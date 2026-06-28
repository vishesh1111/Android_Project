import zipfile
import xml.etree.ElementTree as ET
import re
import json

def parse_docx(files_list, type_override=None):
    items = []
    
    for docx_path in files_list:
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
            if "Commercial Product Catalogue" in clean_line or "Total Models" in clean_line or "Complete Product Data" in clean_line or clean_line == "VIVA FITNESS":
                continue
            if clean_line:
                clean_lines.append(clean_line)
        lines = clean_lines

        i = 0
        current_item = None
        while i < len(lines):
            line = lines[i]
            
            # Check if this line is the start of an item
            is_start = False
            type_str = type_override if type_override else "Commercial Equipment"
            skip_count = 0
            
            if i + 1 < len(lines) and (lines[i+1] == "Features & Highlights" or lines[i+1] == "Features and Highlights"):
                is_start = True
                skip_count = 1
            elif i + 2 < len(lines) and (lines[i+2] == "Features & Highlights" or lines[i+2] == "Features and Highlights"):
                is_start = True
                type_str = lines[i+1]
                skip_count = 2
                
            if is_start:
                if current_item:
                    items.append(current_item)
                
                name = line
                name = re.sub(r'^\d+\.\s*', '', name)
                
                current_item = {
                    "name": name,
                    "type": type_str,
                    "features": []
                }
                
                i += skip_count + 1 # skip the name, type (if present), and "Features & Highlights"
                continue
            
            if line == "Features & Highlights" or line == "Features and Highlights" or line == "Key Specifications":
                i += 1
                continue
                
            if current_item:
                current_item["features"].append(line)
            
            i += 1

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
            if "DIMENSION" in features[i].upper():
                if ":" in features[i]:
                    specs["Dimensions"] = features[i].split(":", 1)[1].strip()
                elif i + 1 < len(features):
                    specs["Dimensions"] = features[i+1]
            elif "MAX USER WEIGHT" in features[i].upper():
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
    ts_code += "];\n\n"
    return ts_code

air_rower_items = parse_docx([
    '/Users/visheshverma/Downloads/VIVA_Air_Rower_and_Ski.docx',
    '/Users/visheshverma/Downloads/VIVA_Infinity_Trainer_and_Tyre_Flip.docx'
])
stepmill_items = parse_docx(['/Users/visheshverma/Downloads/VIVA_Stepmill.docx'])
gym_fan_items = parse_docx(['/Users/visheshverma/Downloads/VIVA_Gym_Fan.docx'], "Commercial Gym Fan")

ts_code_air = generate_ts_array(air_rower_items, 'COMMERCIAL_AIR_ROWERS_SKI', 'air-rowers-ski')
ts_code_step = generate_ts_array(stepmill_items, 'COMMERCIAL_STEPMILL', 'step-mill')
ts_code_fan = generate_ts_array(gym_fan_items, 'COMMERCIAL_UNIQUE_PRODUCTS', 'unique-products')

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

insert_index = content.find("export function getLocalProducts")

if insert_index != -1:
    new_content = content[:insert_index] + ts_code_air + ts_code_step + ts_code_fan + content[insert_index:]
    
    new_content = new_content.replace(
        """  if (mainCategory === 'commercial' && subCategory === 'bikes') {
    return COMMERCIAL_BIKES;
  }""",
        """  if (mainCategory === 'commercial' && subCategory === 'bikes') {
    return COMMERCIAL_BIKES;
  }
  if (mainCategory === 'commercial' && subCategory === 'air-rowers-ski') {
    return COMMERCIAL_AIR_ROWERS_SKI;
  }
  if (mainCategory === 'commercial' && subCategory === 'step-mill') {
    return COMMERCIAL_STEPMILL;
  }
  if (mainCategory === 'commercial' && subCategory === 'unique-products') {
    return COMMERCIAL_UNIQUE_PRODUCTS;
  }"""
    )
    
    new_content = new_content.replace(
        "COMMERCIAL_BIKES.find((p) => p.id === id);",
        "COMMERCIAL_BIKES.find((p) => p.id === id) || COMMERCIAL_AIR_ROWERS_SKI.find((p) => p.id === id) || COMMERCIAL_STEPMILL.find((p) => p.id === id) || COMMERCIAL_UNIQUE_PRODUCTS.find((p) => p.id === id);"
    )
    
    with open(products_file, 'w') as f:
        f.write(new_content)
    
    print(f"Successfully added Air Rowers/Ski ({len(air_rower_items)}), Stepmill ({len(stepmill_items)}), Unique Products ({len(gym_fan_items)})")
