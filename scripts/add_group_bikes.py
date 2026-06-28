import re

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'

group_bikes = [
    ("KH-160", "Commercial Group Bike"),
    ("KH-159", "Commercial Group Bike"),
    ("KH-158", "Commercial Group Bike"),
    ("KH-156", "Commercial Group Bike"),
    ("KH-154", "Commercial Group Bike"),
    ("KH-153", "Group Bike"),
    ("KH-142", "Group Bike")
]

new_bikes = ""
for id_prefix, name_suffix in group_bikes:
    name = f"{id_prefix} {name_suffix}"
    new_bikes += f"""
  {{
    id: '{id_prefix.lower()}-group-bike',
    name: '{id_prefix}',
    type: 'Commercial Group Bike',
    shortDescription: 'Premium Commercial Group Bike',
    fullDescription: 'Premium commercial group bike designed for high-intensity indoor cycling classes and cardio workouts.',
    features: [
      'Sturdy commercial-grade frame',
      'Smooth resistance system',
      'Adjustable seat and handlebars',
      'Ergonomic design for comfort',
      'Heavy-duty flywheel'
    ],
    mainCategory: 'commercial',
    subCategory: 'bikes',
    images: [],
    specifications: {{
      'Type': 'Group Bike'
    }},
    inStock: true,
    createdAt: new Date(),
  }},
"""

with open(products_file, 'r') as f:
    content = f.read()

if 'export const COMMERCIAL_BIKES: Product[] = [' in content:
    start_idx = content.find('export const COMMERCIAL_BIKES: Product[] = [')
    # Find the end of this array
    end_idx = content.find('export const COMMERCIAL_AIR_ROWERS_SKI: Product[] = [')
    if end_idx == -1:
        end_idx = content.find('];', start_idx)
    
    # Actually we just want to insert before the nearest `];` after `start_idx` within this block
    # Let's find the `];` that closes COMMERCIAL_BIKES array.
    # A simple way is to find `];\n\nexport const COMMERCIAL_AIR_ROWERS_SKI`
    close_idx = content.rfind('];', start_idx, end_idx)
    
    if close_idx != -1:
        final_content = content[:close_idx] + new_bikes + content[close_idx:]
        with open(products_file, 'w') as f:
            f.write(final_content)
        print("Successfully added 7 Group Bikes.")
    else:
        print("Could not find the end of COMMERCIAL_BIKES array.")
else:
    print("Could not find COMMERCIAL_BIKES")
