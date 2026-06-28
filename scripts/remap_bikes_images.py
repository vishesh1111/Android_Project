import re
import os

images_dir = '/Users/visheshverma/Downloads/CommericalBikes'
images = os.listdir(images_dir)

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

if 'export const COMMERCIAL_BIKES: Product[] = [' in content:
    start_idx = content.find('export const COMMERCIAL_BIKES: Product[] = [')
    end_idx = content.find('export const COMMERCIAL_AIR_ROWERS_SKI: Product[] = [')
    if end_idx == -1:
        end_idx = content.find('];', start_idx) + 2
    
    bikes_content = content[start_idx:end_idx]
    rest_content = content[end_idx:]
    pre_content = content[:start_idx]
else:
    print("Could not find COMMERCIAL_BIKES")
    exit(1)

def simplify_name(name):
    name = re.sub(r'-\d+x\d+', '', name)
    name = name.replace('.jpg', '').replace('.png', '').replace('-pic', '').replace('-PIC', '')
    name = re.sub(r'-[0-9]+$', '', name)
    name = name.lower()
    name = re.sub(r'[^a-z0-9]', '', name)
    name = name.replace('picture', '')
    name = name.replace('forweb', '')
    return name

image_mapping = {}
for img in images:
    if img.endswith('.jpg') or img.endswith('.png'):
        image_mapping[simplify_name(img)] = img

# Find each product and replace its images: [], with the require statement
new_bikes_content = bikes_content
# Matches id or name, let's match both to be robust. But name is better
matches = re.finditer(r"name:\s*['\"]([^'\"]+)['\"]", bikes_content)

success_count = 0
for match in matches:
    product_name = match.group(1)
    simple_prod_name = simplify_name(product_name)
    
    matched_img = None
    
    # Sort keys for exact matches first
    for key in sorted(image_mapping.keys(), key=len, reverse=True):
        if simple_prod_name == key or simple_prod_name in key or key in simple_prod_name:
            matched_img = image_mapping[key]
            break
            
    # Some special fixes if needed
    if product_name == "R9001": # R900I in docs
        matched_img = 'r900i-pic-500x500.jpg'
    elif product_name == "R900":
        matched_img = 'r900-pic-500x500.jpg'
    elif product_name == "U9001": # U900I in docs
        matched_img = 'u900-I-pic-500x500.jpg'
    elif product_name == "U900":
        matched_img = 'u900-pic-500x500.jpg'

    if matched_img:
        search_start = match.start()
        
        img_match = re.search(r'images:\s*\[\s*\]\s*,', new_bikes_content[search_start:])
        if img_match:
            abs_start = search_start + img_match.start()
            abs_end = search_start + img_match.end()
            replacement = f"images: [require('@/assets/images/products/{matched_img}')],"
            new_bikes_content = new_bikes_content[:abs_start] + replacement + new_bikes_content[abs_end:]
            success_count += 1
            print(f"Matched {product_name} -> {matched_img}")
        else:
            print(f"Could not find empty images array for {product_name} - might be mapped already?")
    else:
        print(f"No image matched for {product_name} (simplified: {simple_prod_name})")

final_content = pre_content + new_bikes_content + rest_content

with open(products_file, 'w') as f:
    f.write(final_content)

print(f"Successfully mapped {success_count} images.")
