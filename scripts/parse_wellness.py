import zipfile
import xml.etree.ElementTree as ET
import re
import json

docx_path = '/Users/visheshverma/Downloads/wellness.docx'
products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

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

# First line is "Massage and Wellness Equipments Specifications", skip it
if lines and "Massage" in lines[0] and "Specifications" in lines[0]:
    lines = lines[1:]

# Strip citations
clean_lines = []
for line in lines:
    clean_line = re.sub(r'\[cite:[^\]]+\]', '', line).strip()
    clean_line = re.sub(r'\s*\.\s*$', '', clean_line).strip()
    if clean_line:
        clean_lines.append(clean_line)
lines = clean_lines

wellness_items = []
current_item = None

for i, line in enumerate(lines):
    if i + 1 < len(lines) and lines[i+1] == "Specifications:":
        if current_item:
            wellness_items.append(current_item)
        
        name = line
        type_str = "Wellness Equipment"
        
        if "Massage Chair" in line:
            type_str = "Massage Chair"
            name = line.replace("Massage Chair", "").strip()
        elif "Eye Massager" in line:
            type_str = "Eye Massager"
            name = line.replace("Eye Massager", "").strip()
        elif "Knee Massager" in line:
            type_str = "Knee Massager"
            name = line.replace("Knee Massager", "").strip()
        
        current_item = {
            "name": name,
            "type": type_str,
            "features": []
        }
    elif line == "Specifications:":
        continue
    else:
        if current_item:
            current_item["features"].append(line)

if current_item:
    wellness_items.append(current_item)

# Generate TS code
ts_code = "export const DOMESTIC_X_SERIES: Product[] = [\n"

for t in wellness_items:
    id_str = 'wellness-' + re.sub(r'[^a-z0-9]+', '-', t['name'].lower()).strip('-')
    
    specs = {}
    for f in t['features']:
        if "Color Options" in f:
             if ":" in f:
                 specs["Color Options"] = f.split(":", 1)[1].strip()
    
    short_desc = t['features'][0] if len(t['features']) > 0 else ""
    full_desc = f"{t['type']}."
    
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
    subCategory: 'x-series',
    images: [],
    specifications: {{
      {specs_ts}
    }},
    inStock: true,
    createdAt: new Date(),
  }},
"""

ts_code += "];\n\n"

# Now modify products.ts
with open(products_file, 'r') as f:
    products_content = f.read()

insert_index = products_content.find("export function getLocalProducts")

if insert_index != -1:
    new_products_content = products_content[:insert_index] + ts_code + products_content[insert_index:]
    
    # Update getLocalProducts
    new_products_content = new_products_content.replace(
        """  if (mainCategory === 'domestic' && subCategory === 'strength-training') {
    return DOMESTIC_STRENGTH;
  }""",
        """  if (mainCategory === 'domestic' && subCategory === 'strength-training') {
    return DOMESTIC_STRENGTH;
  }
  if (mainCategory === 'domestic' && subCategory === 'x-series') {
    return DOMESTIC_X_SERIES;
  }"""
    )
    
    # Update getLocalProductById
    new_products_content = new_products_content.replace(
        "DOMESTIC_STRENGTH.find((p) => p.id === id);",
        "DOMESTIC_STRENGTH.find((p) => p.id === id) || DOMESTIC_X_SERIES.find((p) => p.id === id);"
    )
    
    with open(products_file, 'w') as f:
        f.write(new_products_content)
    
    print(f"Successfully processed {len(wellness_items)} items and updated {products_file}")
else:
    print("Could not find insertion point.")
