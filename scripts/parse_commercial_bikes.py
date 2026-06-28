import zipfile
import xml.etree.ElementTree as ET
import re
import json

files_to_parse = [
    '/Users/visheshverma/Downloads/Commercial_Recumbent_Bike_Specifications.docx',
    '/Users/visheshverma/Downloads/Commercial_Upright_Bike_Specifications.docx',
    '/Users/visheshverma/Downloads/Commercial_Air_Bike_Specifications.docx'
]
products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

items = []
current_item = None

for docx_path in files_to_parse:
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

    # First line is usually the header
    if lines and "Specifications" in lines[0] or "Bike" in lines[0]:
        # sometimes it spans two lines? let's just use heuristic
        if "Specifications" in lines[0] and ":" not in lines[0]:
            lines = lines[1:]

    # Strip citations
    clean_lines = []
    for line in lines:
        clean_line = re.sub(r'\[cite:[^\]]+\]', '', line).strip()
        clean_line = re.sub(r'\s*\.\s*$', '', clean_line).strip()
        if clean_line:
            clean_lines.append(clean_line)
    lines = clean_lines

    for i, line in enumerate(lines):
        if i + 1 < len(lines) and lines[i+1] == "Specifications:":
            if current_item:
                items.append(current_item)
            
            name = line
            type_str = "Commercial Bike"
            
            if "Recumbent" in docx_path:
                type_str = "Commercial Recumbent Bike"
            elif "Upright" in docx_path:
                type_str = "Commercial Upright Bike"
            elif "Air" in docx_path:
                type_str = "Commercial Air Bike"
            
            if "Commercial Recumbent Bike" in name:
                name = name.replace("Commercial Recumbent Bike", "").strip()
            elif "Commercial Upright Bike" in name:
                name = name.replace("Commercial Upright Bike", "").strip()
            elif "Commercial Air Bike" in name:
                name = name.replace("Commercial Air Bike", "").strip()
            elif "Recumbent Bike" in name:
                name = name.replace("Recumbent Bike", "").strip()
            elif "Upright Bike" in name:
                name = name.replace("Upright Bike", "").strip()
            elif "Air Bike" in name:
                name = name.replace("Air Bike", "").strip()
            
            current_item = {
                "name": name,
                "type": type_str,
                "features": []
            }
        elif line == "Specifications:":
            continue
        elif "Specifications" in line and len(line) < 25 and not ":" in line:
            # Maybe a header like "Commercial Air Bike Specifications", skip
            continue
        else:
            if current_item:
                current_item["features"].append(line)

if current_item:
    items.append(current_item)

# Generate TS code
ts_code = "export const COMMERCIAL_BIKES: Product[] = [\n"

for t in items:
    id_str = 'comm-bike-' + re.sub(r'[^a-z0-9]+', '-', t['name'].lower()).strip('-')
    
    # Extract some key specs
    specs = {}
    for f in t['features']:
        if "LXWXH" in f.upper():
             if ":" in f:
                 specs["Dimensions (LXWXH)"] = f.split(":", 1)[1].strip()
             else:
                 specs["Dimensions (LXWXH)"] = f
        elif "WEIGHT" in f.upper():
             if ":" in f:
                 if "MAX" in f.upper():
                     specs["Max User Weight"] = f.split(":", 1)[1].strip()
                 else:
                     specs["Weight"] = f.split(":", 1)[1].strip()
        elif "RESISTANCE" in f.upper() or "TENSION" in f.upper():
             if ":" in f:
                 specs["Resistance"] = f.split(":", 1)[1].strip()
        elif "DISPLAY" in f.upper():
             if ":" in f:
                 specs["Display"] = f.split(":", 1)[1].strip()
        elif "POWER" in f.upper():
             if ":" in f:
                 specs["Power"] = f.split(":", 1)[1].strip()
    
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
    mainCategory: 'commercial',
    subCategory: 'bikes',
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
        """  if (mainCategory === 'commercial' && subCategory === 'elliptical-trainers') {
    return COMMERCIAL_ELLIPTICALS;
  }""",
        """  if (mainCategory === 'commercial' && subCategory === 'elliptical-trainers') {
    return COMMERCIAL_ELLIPTICALS;
  }
  if (mainCategory === 'commercial' && subCategory === 'bikes') {
    return COMMERCIAL_BIKES;
  }"""
    )
    
    # Update getLocalProductById
    new_products_content = new_products_content.replace(
        "COMMERCIAL_ELLIPTICALS.find((p) => p.id === id);",
        "COMMERCIAL_ELLIPTICALS.find((p) => p.id === id) || COMMERCIAL_BIKES.find((p) => p.id === id);"
    )
    
    with open(products_file, 'w') as f:
        f.write(new_products_content)
    
    print(f"Successfully processed {len(items)} items and updated {products_file}")
else:
    print("Could not find insertion point.")
