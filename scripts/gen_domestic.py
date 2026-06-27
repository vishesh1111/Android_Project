#!/usr/bin/env python3
"""Parse Domestic.docx and generate TypeScript DOMESTIC_TREADMILLS array."""

import zipfile
import xml.etree.ElementTree as ET
import re
import json

docx_path = '/Users/visheshverma/Downloads/Domestic.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    with z.open('word/document.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

lines = []
paragraphs = root.findall('.//w:p', ns)
for p in paragraphs:
    texts = []
    for run in p.findall('.//w:r', ns):
        t = run.find('w:t', ns)
        if t is not None and t.text:
            texts.append(t.text)
    line = ''.join(texts).strip()
    if line:
        lines.append(line)

# Find treadmill model lines
model_indices = []
for i, line in enumerate(lines):
    if 'Treadmill' in line and 'Specifications' not in line and line != 'Treadmill Specifications':
        model_indices.append(i)

# Parse each treadmill
treadmills = []
for idx, start in enumerate(model_indices):
    end = model_indices[idx + 1] if idx + 1 < len(model_indices) else len(lines)
    
    title_line = lines[start]
    # Parse model name and type
    # Patterns: "Q7i Commercial Treadmill", "T-940 Light Commercial Treadmill", "T-910 Motorized Treadmill", "1-99 Motorized Treadmill", "T146 Motorized Treadmill"
    match = re.match(r'^(.+?)\s+((?:Light\s+)?(?:Commercial|Motorized)\s+Treadmill)$', title_line)
    if match:
        model_name = match.group(1).strip()
        treadmill_type = match.group(2).strip()
    else:
        model_name = title_line
        treadmill_type = 'Motorized Treadmill'
    
    # Collect spec lines (skip 'Specifications:' line)
    spec_lines = []
    for j in range(start + 1, end):
        line = lines[j]
        if line == 'Specifications:':
            continue
        spec_lines.append(line)
    
    # Generate ID: kebab-case, prefixed with 'dom-'
    id_base = model_name.lower().replace(' ', '-')
    treadmill_id = f'dom-{id_base}'
    
    # Extract specifications as key-value pairs
    specs = {}
    
    # Motor
    for sl in spec_lines:
        motor_match = re.search(r'(?:DC Motor|AC Motor|motor)[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if not motor_match:
            motor_match = re.search(r'(\d+(?:\.\d+)?\s*HP\s+powerful\s+(?:AC|DC)\s+(?:grade\s+)?motor\s*\(.+?\))', sl, re.I)
        if motor_match:
            raw = motor_match.group(1).strip().rstrip('.')
            specs['Motor'] = raw
            break
    
    # Speed
    for sl in spec_lines:
        speed_match = re.search(r'Speed(?:\s+Range)?[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if speed_match and 'speed' not in speed_match.group(1).lower().split(',')[0][:5]:
            specs['Speed'] = speed_match.group(1).strip().rstrip('.')
            break
    
    # Incline
    for sl in spec_lines:
        incline_match = re.search(r'(?:Power\s+)?Incline[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if incline_match:
            specs['Incline'] = incline_match.group(1).strip().rstrip('.')
            break
    
    # Running Surface
    for sl in spec_lines:
        surface_match = re.search(r'Running\s+[Ss]urface[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if surface_match:
            specs['Running Surface'] = surface_match.group(1).strip().rstrip('.')
            break
    
    # Display
    for sl in spec_lines:
        display_match = re.search(r'Display[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if display_match:
            specs['Display'] = display_match.group(1).strip().rstrip('.')
            break
        # Also check for TFT/LCD/LED screen in first line
        if 'TFT Screen' in sl or 'LCD' in sl or 'LED' in sl:
            if 'readout' not in sl.lower() and 'display' not in sl.lower():
                if not specs.get('Display'):
                    specs['Display'] = sl.strip().rstrip('.')
    
    # Max User Weight
    for sl in spec_lines:
        weight_match = re.search(r'(?:Maximum|Max)\s+[Uu]ser\s+[Ww]eight[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if weight_match:
            specs['Max User Weight'] = weight_match.group(1).strip().rstrip('.')
            break
    
    # Dimensions
    for sl in spec_lines:
        dim_match = re.search(r'LXWXH[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if dim_match:
            specs['Dimensions (LXWXH)'] = dim_match.group(1).strip().rstrip('.')
            break
    
    # Programs
    for sl in spec_lines:
        prog_match = re.search(r'Programs?[:\s]*(.+?)(?:\.)?$', sl, re.I)
        if prog_match and 'workout programs' not in sl.lower() and 'landscape programs' not in sl.lower():
            specs['Programs'] = prog_match.group(1).strip().rstrip('.')
            break
    
    # Connectivity - check for bluetooth, wifi, etc.
    connectivity_parts = []
    for sl in spec_lines:
        if 'bluetooth' in sl.lower() or 'wi-fi' in sl.lower() or 'wifi' in sl.lower():
            if 'Wi-Fi' in sl or 'wifi' in sl.lower():
                connectivity_parts.append('Wi-Fi')
            if 'bluetooth' in sl.lower() or 'Bluetooth' in sl:
                connectivity_parts.append('Bluetooth')
            if 'kinomap' in sl.lower() or 'Kinomap' in sl:
                connectivity_parts.append('Kinomap')
            if 'zwift' in sl.lower() or 'Zwift' in sl:
                connectivity_parts.append('Zwift')
            if 'fitshow' in sl.lower() or 'Fitshow' in sl:
                connectivity_parts.append('Fitshow')
    if connectivity_parts:
        specs['Connectivity'] = ', '.join(dict.fromkeys(connectivity_parts))
    
    # Build short description from motor + running surface
    motor_str = specs.get('Motor', '')
    surface_str = specs.get('Running Surface', '')
    if motor_str and surface_str:
        short_desc = f'{motor_str}, {surface_str} running surface'
    elif motor_str:
        short_desc = motor_str
    else:
        short_desc = spec_lines[0] if spec_lines else title_line
    
    # Build full description
    speed_str = specs.get('Speed', '')
    incline_str = specs.get('Incline', '')
    parts = [f'{treadmill_type} featuring {motor_str}' if motor_str else f'{treadmill_type}']
    if surface_str:
        parts.append(f'{surface_str} running surface')
    if speed_str:
        parts.append(f'speeds up to {speed_str}')
    if incline_str:
        parts.append(f'{incline_str} incline')
    full_desc = ', '.join(parts) + '.'
    
    treadmills.append({
        'id': treadmill_id,
        'name': model_name,
        'type': treadmill_type,
        'shortDescription': short_desc,
        'fullDescription': full_desc,
        'features': spec_lines,
        'specs': specs,
    })

# Generate TypeScript
def escape_ts(s):
    """Escape string for TypeScript single-quoted string."""
    return s.replace("\\", "\\\\").replace("'", "\\'")

output_lines = []
output_lines.append('')
output_lines.append('export const DOMESTIC_TREADMILLS: Product[] = [')

for i, t in enumerate(treadmills):
    output_lines.append(f'  // {str(i+1).zfill(2)}. {t["name"]}')
    output_lines.append('  {')
    output_lines.append(f"    id: '{escape_ts(t['id'])}',")
    output_lines.append(f"    name: '{escape_ts(t['name'])}',")
    output_lines.append(f"    type: '{escape_ts(t['type'])}',")
    output_lines.append(f"    shortDescription: '{escape_ts(t['shortDescription'])}',")
    output_lines.append(f"    fullDescription:")
    output_lines.append(f"      '{escape_ts(t['fullDescription'])}',")
    output_lines.append('    features: [')
    for feat in t['features']:
        output_lines.append(f"      '{escape_ts(feat)}',")
    output_lines.append('    ],')
    output_lines.append("    mainCategory: 'domestic',")
    output_lines.append("    subCategory: 'treadmills',")
    output_lines.append('    images: [],')
    output_lines.append('    specifications: {')
    for k, v in t['specs'].items():
        output_lines.append(f"      '{escape_ts(k)}': '{escape_ts(v)}',")
    output_lines.append('    },')
    output_lines.append('    inStock: true,')
    output_lines.append('    createdAt: new Date(),')
    output_lines.append('  },')
    if i < len(treadmills) - 1:
        output_lines.append('')

output_lines.append('];')

print('\n'.join(output_lines))
