import re

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

with open(products_file, 'r') as f:
    content = f.read()

start_idx = content.find('export const COMMERCIAL_BIKES: Product[] = [')
end_idx = content.find('export const COMMERCIAL_AIR_ROWERS_SKI: Product[] = [')

if start_idx != -1 and end_idx != -1:
    bikes_content = content[start_idx:end_idx]
    
    # Let's cleanly remove recumbent bikes
    # A product object starts with   { and ends with   },
    # We can split by '  {\n' and filter out the ones containing "Commercial Recumbent Bike"
    
    blocks = bikes_content.split('  {\n')
    cleaned_blocks = [blocks[0]] # the first part before the first {
    
    for block in blocks[1:]:
        if "Commercial Recumbent Bike" not in block:
            cleaned_blocks.append('  {\n' + block)
    
    cleaned_bikes = "".join(cleaned_blocks)
    
    new_recumbents = """  {
    id: 'comm-bikes-r900i',
    name: 'R900i',
    type: 'Commercial Recumbent Bike',
    shortDescription: 'Display: 15.6" TFT touch screen',
    fullDescription: 'Premium Commercial Recumbent Bike.',
    features: [
      'Display: 15.6" TFT touch screen',
      'Advanced resistance system',
      'Ergonomic seating'
    ],
    mainCategory: 'commercial',
    subCategory: 'bikes',
    images: [require('@/assets/images/products/r900i-pic-500x500.jpg')],
    specifications: {},
    inStock: true,
    createdAt: new Date(),
  },
  {
    id: 'comm-bikes-kh3040',
    name: 'KH-3040',
    type: 'Commercial Recumbent Bike',
    shortDescription: 'Premium Commercial Recumbent Bike',
    fullDescription: 'Premium Commercial Recumbent Bike.',
    features: [
      'Sturdy commercial-grade frame',
      'Smooth resistance system',
      'Adjustable seat with back support'
    ],
    mainCategory: 'commercial',
    subCategory: 'bikes',
    images: [require('@/assets/images/products/kh3040-500x500.jpg')],
    specifications: {},
    inStock: true,
    createdAt: new Date(),
  },
  {
    id: 'comm-bikes-r900',
    name: 'R900',
    type: 'Commercial Recumbent Bike',
    shortDescription: 'Resistance: Magnetron resistance system',
    fullDescription: 'Premium Commercial Recumbent Bike.',
    features: [
      'Resistance: Magnetron resistance system',
      'Ergonomic seating'
    ],
    mainCategory: 'commercial',
    subCategory: 'bikes',
    images: [require('@/assets/images/products/r900-pic-500x500.jpg')],
    specifications: {},
    inStock: true,
    createdAt: new Date(),
  },
  {
    id: 'comm-bikes-kh619',
    name: 'KH-619',
    type: 'Commercial Recumbent Bike',
    shortDescription: 'Premium Commercial Recumbent Bike',
    fullDescription: 'Premium Commercial Recumbent Bike.',
    features: [
      'Sturdy commercial-grade frame',
      'Smooth resistance system',
      'Adjustable seat with back support'
    ],
    mainCategory: 'commercial',
    subCategory: 'bikes',
    images: [require('@/assets/images/products/KH619-500x500.jpg')],
    specifications: {},
    inStock: true,
    createdAt: new Date(),
  },
  {
    id: 'comm-bikes-kh850',
    name: 'KH-850',
    type: 'Commercial Recumbent Bike',
    shortDescription: 'Premium Commercial Recumbent Bike',
    fullDescription: 'Premium Commercial Recumbent Bike.',
    features: [
      'Sturdy commercial-grade frame',
      'Smooth resistance system',
      'Adjustable seat with back support'
    ],
    mainCategory: 'commercial',
    subCategory: 'bikes',
    images: [require('@/assets/images/products/kh850-500x500.jpg')],
    specifications: {},
    inStock: true,
    createdAt: new Date(),
  },
  {
    id: 'comm-bikes-kh575',
    name: 'KH-575',
    type: 'Commercial Recumbent Bike',
    shortDescription: 'Premium Commercial Recumbent Bike',
    fullDescription: 'Premium Commercial Recumbent Bike.',
    features: [
      'Sturdy commercial-grade frame',
      'Smooth resistance system',
      'Adjustable seat with back support'
    ],
    mainCategory: 'commercial',
    subCategory: 'bikes',
    images: [require('@/assets/images/products/KH575-500x500.jpg')],
    specifications: {},
    inStock: true,
    createdAt: new Date(),
  },\n"""
    
    # Insert new_recumbents right after 'export const COMMERCIAL_BIKES: Product[] = [\n'
    insert_point = cleaned_bikes.find('[\n') + 2
    if insert_point == 1: # Fallback if `[\n` not found
        insert_point = cleaned_bikes.find('[') + 1
        
    final_bikes = cleaned_bikes[:insert_point] + new_recumbents + cleaned_bikes[insert_point:]
    
    final_content = content[:start_idx] + final_bikes + content[end_idx:]
    with open(products_file, 'w') as f:
        f.write(final_content)
    print("Successfully replaced recumbent bikes cleanly.")
else:
    print("Could not find COMMERCIAL_BIKES")
