import re

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

start_idx = content.find('export const COMMERCIAL_BIKES: Product[] = [')
end_idx = content.find('export const COMMERCIAL_AIR_ROWERS_SKI: Product[] = [')

if start_idx != -1 and end_idx != -1:
    bikes_content = content[start_idx:end_idx]
    # Reset all images: [require(...)] to images: []
    reset_content = re.sub(r"images:\s*\[require\('@/assets/images/products/[^']+'\)\]\s*,", "images: [],", bikes_content)
    
    final_content = content[:start_idx] + reset_content + content[end_idx:]
    with open(products_file, 'w') as f:
        f.write(final_content)
    print("Reset bikes images.")
else:
    print("Could not find blocks.")
