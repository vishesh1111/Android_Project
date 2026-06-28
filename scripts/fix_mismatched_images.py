import re

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

# Fixes
replacements = {
    # E700I (E7001 in docx)
    "name: \"E7001\",": ("images: [],", "images: [require('@/assets/images/products/e700I-500x500.jpg')],"),
    
    # E900I (E9001 in docx) -> E900i-pic
    "name: \"E9001\",": ("images: [require('@/assets/images/products/E900-PIC-500x500.jpg')],", "images: [require('@/assets/images/products/E900i-pic-500x500.jpg')],"),
    
    # E900 -> E900-pic
    "name: \"E900\",": ("images: [require('@/assets/images/products/E900i-pic-500x500.jpg')],", "images: [require('@/assets/images/products/E900-PIC-500x500.jpg')],"),
    
    # KH965 Light -> KH965PIC
    "name: \"KH965 Light\",": ("images: [require('@/assets/images/products/KH-960-500x500.jpg')],", "images: [require('@/assets/images/products/KH965PIC-500x500.jpg')],")
}

for name_str, (old_img, new_img) in replacements.items():
    idx = content.find(name_str)
    if idx != -1:
        # search for old_img right after name
        end_idx = content.find("mainCategory:", idx)
        block = content[idx:end_idx]
        new_block = block.replace(old_img, new_img)
        content = content[:idx] + new_block + content[end_idx:]
        print(f"Fixed {name_str}")

with open(products_file, 'w') as f:
    f.write(content)
