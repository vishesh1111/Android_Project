import zipfile
import xml.etree.ElementTree as ET
import re
import json

def parse_docx_old(docx_path):
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

    clean_lines = []
    for line in lines:
        clean_line = re.sub(r'\[cite:[^\]]+\]', '', line).strip()
        clean_line = re.sub(r'\s*\.\s*$', '', clean_line).strip()
        if "Specifications" in clean_line and "Commercial" in clean_line and len(clean_line) < 50:
            continue
        if clean_line:
            clean_lines.append(clean_line)
    lines = clean_lines

    items = []
    current_item = None

    for i, line in enumerate(lines):
        if i + 1 < len(lines) and lines[i+1] == "Specifications:":
            if current_item:
                items.append(current_item)
            
            name = line
            type_str = "Commercial Bike"
            
            if "Recumbent Bike" in line:
                name = line.replace("Commercial Recumbent Bike", "").replace("Recumbent Bike", "").strip()
                type_str = "Commercial Recumbent Bike"
            elif "Upright Bike" in line:
                name = line.replace("Commercial Upright Bike", "").replace("Upright Bike", "").strip()
                type_str = "Commercial Upright Bike"
            elif "Air Bike" in line:
                name = line.replace("Commercial Air Bike", "").replace("Air Bike", "").strip()
                type_str = "Commercial Air Bike"

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
        items.append(current_item)
        
    return items

def generate_ts_array(items, array_name, subcat):
    ts_code = f"export const {array_name}: Product[] = [\n"
    
    for t in items:
        id_str = f'comm-{subcat}-' + re.sub(r'[^a-z0-9]+', '-', t['name'].lower()).strip('-')
        
        specs = {}
        features = []
        
        for f in t['features']:
            features.append(f)
            
        for i in range(len(features)):
            if "DIMENSION" in features[i].upper() or "LXWXH" in features[i].upper():
                if ":" in features[i]:
                    specs["Dimensions"] = features[i].split(":", 1)[1].strip()
                elif i + 1 < len(features):
                    specs["Dimensions"] = features[i+1]
            elif "MAX USER WEIGHT" in features[i].upper() or "MAXIMUM USER WEIGHT" in features[i].upper():
                if ":" in features[i]:
                    specs["Max User Weight"] = features[i].split(":", 1)[1].strip()
                elif i + 1 < len(features):
                    specs["Max User Weight"] = features[i+1]
            elif "WEIGHT" in features[i].upper() and "MAX" not in features[i].upper():
                if ":" in features[i]:
                    specs["Weight"] = features[i].split(":", 1)[1].strip()
                elif i + 1 < len(features):
                    specs["Weight"] = features[i+1]
            elif "RESISTANCE" in features[i].upper() or "POWER" in features[i].upper():
                if ":" in features[i]:
                    val = features[i].split(":", 1)[1].strip()
                    if val:
                        specs[features[i].split(":")[0].strip()] = val
            elif ":" in features[i]:
                k, v = features[i].split(":", 1)
                specs[k.strip()] = v.strip()
            
        short_desc = features[0] if len(features) > 0 else ""
        full_desc = f"{t['type']}."
        
        features_ts = ",\n      ".join([json.dumps(f) for f in features])
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
    subCategory: '{subcat}',
    images: [],
    specifications: {{
      {specs_ts}
    }},
    inStock: true,
    createdAt: new Date(),
  }},
"""
    ts_code += "];"
    return ts_code

bike_docs = [
    '/Users/visheshverma/Downloads/Commercial_Recumbent_Bike_Specifications.docx',
    '/Users/visheshverma/Downloads/Commercial_Upright_Bike_Specifications.docx',
    '/Users/visheshverma/Downloads/Commercial_Air_Bike_Specifications.docx'
]
all_bikes = []
for doc in bike_docs:
    all_bikes.extend(parse_docx_old(doc))

ts_code = generate_ts_array(all_bikes, 'COMMERCIAL_BIKES', 'bikes')

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

# Replace the empty array
target = "export const COMMERCIAL_BIKES: Product[] = [\n];"
if target in content:
    new_content = content.replace(target, ts_code)
    with open(products_file, 'w') as f:
        f.write(new_content)
    print(f"Successfully fixed Bikes. Count: {len(all_bikes)}")
else:
    print("Could not find empty COMMERCIAL_BIKES array")
