import os

products_file = '/Users/visheshverma/Documents/Android_Client/src/constants/products.ts'
domestic_file = '/Users/visheshverma/Documents/Android_Client/scripts/domestic_ts.txt'

with open(products_file, 'r') as f:
    lines = f.readlines()

with open(domestic_file, 'r') as f:
    domestic_code = f.read()

# Lines 0 to 1101 (up to the end of COMMERCIAL_TREADMILLS array)
new_code = "".join(lines[:1101]) + "\n\n"

# Append domestic treadmills
new_code += domestic_code + "\n"

# Append updated helper functions
new_code += """
/**
 * Returns local products matching the given mainCategory and subCategory.
 */
export function getLocalProducts(
  mainCategory: string,
  subCategory: string,
): Product[] {
  if (mainCategory === 'commercial' && subCategory === 'treadmills') {
    return COMMERCIAL_TREADMILLS;
  }
  if (mainCategory === 'domestic' && subCategory === 'treadmills') {
    return DOMESTIC_TREADMILLS;
  }
  return [];
}

/**
 * Finds a single product by its id from all local product data.
 */
export function getLocalProductById(id: string): Product | undefined {
  return COMMERCIAL_TREADMILLS.find((p) => p.id === id) || DOMESTIC_TREADMILLS.find((p) => p.id === id);
}
"""

with open(products_file, 'w') as f:
    f.write(new_code)

print("Updated products.ts")
