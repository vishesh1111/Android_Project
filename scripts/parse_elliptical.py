import zipfile
import xml.etree.ElementTree as ET
import re
import json

docx_path = '/Users/visheshverma/Downloads/elliptical.docx'
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

# First line is "Elliptical Specifications", skip it
if lines and "Elliptical" in lines[0] and "Specifications" in lines[0]:
    lines = lines[1:]

ellipticals = []
current_elliptical = None

for i, line in enumerate(lines):
    # A new elliptical starts with a line that ends with "Elliptical" or "Cross Trainer" (usually) or is followed by "Specifications:"
    if i + 1 < len(lines) and lines[i+1] == "Specifications:":
        if current_elliptical:
            ellipticals.append(current_elliptical)
        
        # Name splitting logic
        name = line
        type_str = "Elliptical Trainer"
        
        words = line.split()
        if "Elliptical" in words:
            idx = words.index("Elliptical")
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
        elif "Trainer" in words and "Cross" in words:
            idx = words.index("Trainer")
            if idx > 1 and words[idx-1] == "Cross":
                name = " ".join(words[:idx-1])
                type_str = " ".join(words[idx-1:])
        elif "Trainer" in words:
            idx = words.index("Trainer")
            name = " ".join(words[:idx])
            type_str = " ".join(words[idx:])
            
        current_elliptical = {
            "name": name,
            "type": type_str,
            "features": []
        }
    elif line == "Specifications:":
        continue
    else:
        if current_elliptical:
            current_elliptical["features"].append(line)

if current_elliptical:
    ellipticals.append(current_elliptical)

# Generate TS code
ts_code = "export const DOMESTIC_ELLIPTICALS: Product[] = [\n"

for t in ellipticals:
    id_str = 'ellip-' + re.sub(r'[^a-z0-9]+', '-', t['name'].lower()).strip('-')
    
    # Extract some key specs
    specs = {}
    resistance = ""
    stride = ""
    flywheel = ""
    
    for f in t['features']:
        if "resistance" in f.lower() or "level" in f.lower():
             if ":" in f:
                 resistance = f.split(":", 1)[1].strip()
                 specs["Resistance"] = resistance
        elif "stride" in f.lower():
             if ":" in f:
                 stride = f.split(":", 1)[1].strip()
             else:
                 stride = f
             specs["Stride"] = stride
        elif "flywheel" in f.lower() or "fly wheel" in f.lower():
             if ":" in f:
                 flywheel = f.split(":", 1)[1].strip()
             else:
                 flywheel = f
             specs["Flywheel"] = flywheel
        elif "display" in f.lower() or "readout" in f.lower():
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
    subCategory: 'elliptical-trainers',
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

# We need to insert this right before `export function getLocalProducts`
insert_index = products_content.find("export function getLocalProducts")

if insert_index != -1:
    new_products_content = products_content[:insert_index] + ts_code + products_content[insert_index:]
    
    # Update getLocalProducts
    new_products_content = new_products_content.replace(
        """  if (mainCategory === 'domestic' && subCategory === 'treadmills') {
    return DOMESTIC_TREADMILLS;
  }""",
        """  if (mainCategory === 'domestic' && subCategory === 'treadmills') {
    return DOMESTIC_TREADMILLS;
  }
  if (mainCategory === 'domestic' && subCategory === 'elliptical-trainers') {
    return DOMESTIC_ELLIPTICALS;
  }"""
    )
    
    # Update getLocalProductById
    new_products_content = new_products_content.replace(
        "return COMMERCIAL_TREADMILLS.find((p) => p.id === id) || DOMESTIC_TREADMILLS.find((p) => p.id === id);",
        "return COMMERCIAL_TREADMILLS.find((p) => p.id === id) || DOMESTIC_TREADMILLS.find((p) => p.id === id) || DOMESTIC_ELLIPTICALS.find((p) => p.id === id);"
    )
    
    with open(products_file, 'w') as f:
        f.write(new_products_content)
    
    print(f"Successfully processed {len(ellipticals)} ellipticals and updated {products_file}")
else:
    print("Could not find insertion point.")
