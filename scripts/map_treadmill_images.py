import os
import re

images_dir = '/Users/visheshverma/Downloads/commercialtreadmill'
images = os.listdir(images_dir)

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

# Split content into COMMERCIAL_TREADMILLS part and the rest
if 'export const COMMERCIAL_TREADMILLS: Product[] = [' in content:
    start_idx = content.find('export const COMMERCIAL_TREADMILLS: Product[] = [')
    end_idx = content.find('];', start_idx) + 2
    
    treadmills_content = content[start_idx:end_idx]
    rest_content = content[end_idx:]
    pre_content = content[:start_idx]
else:
    print("Could not find COMMERCIAL_TREADMILLS")
    exit(1)

def simplify_name(name):
    # Remove file extensions, sizes, and special characters
    name = re.sub(r'-\d+x\d+', '', name)
    name = name.replace('.jpg', '').replace('.png', '')
    name = re.sub(r'-[0-9]+$', '', name) # remove trailing numbers like -1, -3
    name = name.lower()
    name = re.sub(r'[^a-z0-9]', '', name)
    name = name.replace('genisis', 'genesis')
    return name

image_mapping = {}
for img in images:
    if img.endswith('.jpg') or img.endswith('.png'):
        image_mapping[simplify_name(img)] = img

# Now find each treadmill and replace its images: [], with the require statement
new_treadmills_content = treadmills_content
matches = re.finditer(r"name:\s*'([^']+)'", treadmills_content)

success_count = 0
for match in matches:
    product_name = match.group(1)
    simple_prod_name = simplify_name(product_name)
    
    # Try to find matching image
    matched_img = None
    for key, img in image_mapping.items():
        if simple_prod_name in key or key in simple_prod_name:
            matched_img = img
            break
            
    if matched_img:
        # Find the block for this product
        # The block starts near the match and ends at the next 'name:' or '];'
        search_start = match.start()
        
        # Replace the first `images: [],` after this name with the require
        # Use regex to find images: [], only within this product's block
        # Find the next `images: [],`
        img_match = re.search(r'images:\s*\[\s*\]\s*,', new_treadmills_content[search_start:])
        if img_match:
            abs_start = search_start + img_match.start()
            abs_end = search_start + img_match.end()
            replacement = f"images: [require('@/assets/images/products/{matched_img}')],"
            new_treadmills_content = new_treadmills_content[:abs_start] + replacement + new_treadmills_content[abs_end:]
            success_count += 1
            print(f"Matched {product_name} -> {matched_img}")
        else:
            print(f"Could not find images array for {product_name}")
    else:
        print(f"No image matched for {product_name} (simplified: {simple_prod_name})")

final_content = pre_content + new_treadmills_content + rest_content

with open(products_file, 'w') as f:
    f.write(final_content)

print(f"Successfully mapped {success_count} images.")
