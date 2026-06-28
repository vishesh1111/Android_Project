import re

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

if 'export const COMMERCIAL_TREADMILLS: Product[] = [' in content:
    start_idx = content.find('export const COMMERCIAL_TREADMILLS: Product[] = [')
    end_idx = content.find('export const DOMESTIC_TREADMILLS: Product[] = [')
    if end_idx == -1:
        end_idx = content.find('];', start_idx) + 2
    
    treadmills_content = content[start_idx:end_idx]
    rest_content = content[end_idx:]
    pre_content = content[:start_idx]
else:
    print("Could not find COMMERCIAL_TREADMILLS")
    exit(1)

mapping = {
    'virtual-x': 'VirtualX-1024x1024.jpg',
    'genesis-9i': 'Genesisi-9i-1024x1024.jpg',
    'legacy-i': 'legacy-i-1-500x500.jpg',
    't6000': 'T6000-3-500x500.jpg',
    't2222': 'T2222-CLUB-500x500.jpg',
    'q9i': 'Q9i-1-500x500.jpg',
    'legacy': 'legacy-1-500x500.jpg',
    'genesis-9': 'genisis-9-1-500x500.jpg',
    't3300': 't3300-1-500x500.jpg',
    't2525': 't2525-new-500x500.jpg',
    'q9': 'q9-1-500x500.jpg',
    'q7i': 'q7i-1-500x500.jpg',
    't1212': 't1212-1-500x500.jpg',
    'q8': 'q8-500x500.jpg',
    'q5i': 'q5i-1-500x500.jpg',
    'x10': 'x10-1-500x500.jpg',
    't3000': 't3000-web-500x500.jpg',
    'q7': 'q7-1-500x500.jpg',
    'q3i': 'q3i-500x500.jpg',
    'x8': 'X8-3-500x500.jpg',
    'q5': 'q5-3-500x500.jpg',
    'q3': 'q3-500x500.jpg',
    't6666': 't6666-2-500x500.jpg',
    't6262': 't6262-500x500.jpg',
    't007': 'T007-I-TRAINER-NEW-500x500.jpg'
}

new_treadmills_content = treadmills_content
success_count = 0

for pid, img in mapping.items():
    # Find the id in the content
    id_pattern = re.compile(rf"id:\s*'({pid})'")
    match = id_pattern.search(new_treadmills_content)
    if match:
        search_start = match.start()
        # Find the next images: [something],
        img_match = re.search(r'images:\s*\[([^\]]*)\]\s*,', new_treadmills_content[search_start:])
        if img_match:
            abs_start = search_start + img_match.start()
            abs_end = search_start + img_match.end()
            replacement = f"images: [require('@/assets/images/products/{img}')],"
            new_treadmills_content = new_treadmills_content[:abs_start] + replacement + new_treadmills_content[abs_end:]
            success_count += 1
            print(f"Remapped {pid} -> {img}")
        else:
            print(f"Could not find images array for {pid}")
    else:
        print(f"Could not find product with id {pid}")

final_content = pre_content + new_treadmills_content + rest_content

with open(products_file, 'w') as f:
    f.write(final_content)

print(f"Successfully remapped {success_count} images.")
