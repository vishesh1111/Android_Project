import re

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

start_idx = content.find('export const COMMERCIAL_BIKES: Product[] = [')
end_idx = content.find('export const COMMERCIAL_AIR_ROWERS_SKI: Product[] = [')

if start_idx != -1 and end_idx != -1:
    bikes_content = content[start_idx:end_idx]
    rest_content = content[end_idx:]
    pre_content = content[:start_idx]
else:
    print("Could not find COMMERCIAL_BIKES")
    exit(1)

mapping = {
    'KH-160': 'KH160-1-500x500.jpg',
    'KH-159': 'kh159-500x500.jpg',
    'KH-158': 'kh158-pic-500x500.jpg',
    'KH-156': 'KH156-PIC-500x500.jpg',
    'KH-154': 'KH154-NEW-500x500.jpg',
    'KH-153': 'KH-153-500x500.jpg',
    'KH-142': 'KH142-1-500x500.jpg',
    'R9001': 'r900i-pic-500x500.jpg',
    'R900': 'r900-pic-500x500.jpg',
    'U9001': 'u900-I-pic-500x500.jpg',
    'KH3020': 'kh3020-500x500.jpg',
    'U900': 'u900-pic-500x500.jpg',
    'U5555': 'U5555-500x500.jpg',
    'KH618': 'kh618-new-500x500.jpg',
    'KH840': 'kh840-pic-500x500.jpg',
    'KH565': 'KH565-500x500.jpg',
    'AB1000': 'ab1000-500x500.jpg',
    'AB700': 'ab700-pic-500x500.jpg',
    'AB400': 'AB400-500x500.jpg'
}

new_bikes_content = bikes_content
success_count = 0

for pid, img in mapping.items():
    id_pattern = re.compile(rf"name:\s*[\"']{pid}[\"']")
    match = id_pattern.search(new_bikes_content)
    if match:
        search_start = match.start()
        img_match = re.search(r'images:\s*\[\s*\]\s*,', new_bikes_content[search_start:])
        if img_match:
            abs_start = search_start + img_match.start()
            abs_end = search_start + img_match.end()
            replacement = f"images: [require('@/assets/images/products/{img}')],"
            new_bikes_content = new_bikes_content[:abs_start] + replacement + new_bikes_content[abs_end:]
            success_count += 1
            print(f"Remapped {pid} -> {img}")
        else:
            print(f"Could not find empty images array for {pid}")
    else:
        print(f"Could not find product with name {pid}")

final_content = pre_content + new_bikes_content + rest_content

with open(products_file, 'w') as f:
    f.write(final_content)

print(f"Successfully remapped {success_count} images.")
