import zipfile
import xml.etree.ElementTree as ET
import re
import json
from datetime import datetime

docx_path = '/Users/visheshverma/Downloads/Domestic.docx'

with zipfile.ZipFile(docx_path, 'r') as z:
    with z.open('word/document.xml') as f:
        tree = ET.parse(f)
        root = tree.getroot()

ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}

lines = []
for p in root.findall('.//w:p', ns):
    texts = []
    for run in p.findall('.//w:r', ns):
        t = run.find('w:t', ns)
        if t is not None and t.text:
            texts.append(t.text)
    line = ''.join(texts).strip()
    if line:
        lines.append(line)

# First line is "Treadmill Specifications", skip it
if lines[0] == "Treadmill Specifications":
    lines = lines[1:]

treadmills = []
current_treadmill = None

for i, line in enumerate(lines):
    # A new treadmill starts with a line that ends with "Treadmill" (usually) or is followed by "Specifications:"
    if i + 1 < len(lines) and lines[i+1] == "Specifications:":
        if current_treadmill:
            treadmills.append(current_treadmill)
        
        parts = line.split(" ", 1)
        name = parts[0]
        type_str = parts[1] if len(parts) > 1 else "Treadmill"
        
        # Handle cases like "1-99 Motorized Treadmill"
        if "Treadmill" not in type_str:
            name = line
            type_str = "Treadmill"
        elif type_str == "Treadmill":
            name = line
        
        # More robust name/type splitting
        words = line.split()
        if "Treadmill" in words:
            idx = words.index("Treadmill")
            if idx > 0 and words[idx-1] in ["Commercial", "Motorized"]:
                 if idx > 1 and words[idx-2] == "Light":
                     name = " ".join(words[:idx-2])
                     type_str = " ".join(words[idx-2:])
                 else:
                     name = " ".join(words[:idx-1])
                     type_str = " ".join(words[idx-1:])
            else:
                 name = " ".join(words[:idx])
                 type_str = " ".join(words[idx:])
        
        current_treadmill = {
            "name": name,
            "type": type_str,
            "features": []
        }
    elif line == "Specifications:":
        continue
    else:
        if current_treadmill:
            current_treadmill["features"].append(line)

if current_treadmill:
    treadmills.append(current_treadmill)

# Generate TS code
ts_code = "export const DOMESTIC_TREADMILLS: Product[] = [\n"

for t in treadmills:
    id_str = 'dom-' + re.sub(r'[^a-z0-9]+', '-', t['name'].lower()).strip('-')
    
    # Extract some key specs for short/full description
    motor = ""
    running_surface = ""
    speed = ""
    specs = {}
    
    for f in t['features']:
        if f.lower().startswith("speed"):
             speed = f.split(":", 1)[1].strip() if ":" in f else f
             specs["Speed"] = speed
        elif "motor" in f.lower() or "hp" in f.lower():
             if "Motor:" in f:
                 motor = f.split(":", 1)[1].strip()
             elif "motor" in f.lower():
                 motor = f
             specs["Motor"] = motor
        elif "surface" in f.lower() or "running area" in f.lower():
             if ":" in f:
                 running_surface = f.split(":", 1)[1].strip()
             else:
                 running_surface = f
             specs["Running Surface"] = running_surface
        elif "incline" in f.lower():
             if ":" in f:
                 specs["Incline"] = f.split(":", 1)[1].strip()
             else:
                 specs["Incline"] = f
        elif "display" in f.lower() or "screen" in f.lower() or "window" in f.lower():
             if ":" in f:
                 specs["Display"] = f.split(":", 1)[1].strip()
             else:
                 specs["Display"] = f
        elif "weight" in f.lower():
             if ":" in f:
                 specs["Max User Weight"] = f.split(":", 1)[1].strip()
             else:
                 specs["Max User Weight"] = f
    
    short_desc = t['features'][0] if len(t['features']) > 0 else ""
    full_desc = f"{t['type']} featuring {motor} motor, {running_surface} running surface, and speeds up to {speed}."
    
    features_ts = ",\n      ".join([json.dumps(f) for f in t['features']])
    specs_ts = ",\n      ".join([f"{json.dumps(k)}: {json.dumps(v)}" for k, v in specs.items()])
    
    ts_code += f"""  {{
    id: {json.dumps(id_str)},
    name: {json.dumps(t['name'])},
    type: {json.dumps(t['type'])},
    shortDescription: {json.dumps(short_desc)},
    fullDescription: {json.dumps(full_desc)},
    features: [
      {features_ts}
    ],
    mainCategory: 'domestic',
    subCategory: 'treadmills',
    images: [],
    specifications: {{
      {specs_ts}
    }},
    inStock: true,
    createdAt: new Date(),
  }},
"""

ts_code += "];\n"

print(ts_code)
