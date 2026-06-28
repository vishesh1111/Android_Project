import re

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

start_idx = content.find('export const COMMERCIAL_STEPMILL: Product[] = [')
end_idx = content.find('export const COMMERCIAL_UNIQUE_PRODUCTS: Product[] = [')

if start_idx != -1 and end_idx != -1:
    section_content = content[start_idx:end_idx]
    rest_content = content[end_idx:]
    pre_content = content[:start_idx]
else:
    print("Could not find COMMERCIAL_STEPMILL")
    exit(1)

mapping = {
    'KH5050': 'kh5050-1-500x500.jpg',
    'KH4040': 'kh4040-500x500.jpg',
    'KH3030': 'KH3030-PIC-500x500.jpg'
}

new_section_content = section_content
success_count = 0

for pid, img in mapping.items():
    id_pattern = re.compile(rf"name:\s*[\"']{pid}[\"']")
    match = id_pattern.search(new_section_content)
    if match:
        search_start = match.start()
        img_match = re.search(r'images:\s*\[\s*\]\s*,', new_section_content[search_start:])
        if img_match:
            abs_start = search_start + img_match.start()
            abs_end = search_start + img_match.end()
            replacement = f"images: [require('@/assets/images/products/{img}')],"
            new_section_content = new_section_content[:abs_start] + replacement + new_section_content[abs_end:]
            success_count += 1
            print(f"Remapped {pid} -> {img}")
        else:
            print(f"Could not find empty images array for {pid}")
    else:
        print(f"Could not find product with name {pid}")

final_content = pre_content + new_section_content + rest_content

with open(products_file, 'w') as f:
    f.write(final_content)

print(f"Successfully remapped {success_count} images.")
