/**
 * Filters an array of objects to keep only the first occurrence of an object
 * based on a unique value of a specified key.
 *
 * This function is generic and type-safe. It iterates through the array and uses a
 * Set to track already encountered key values, effectively removing duplicates.
 *
 * @template T The type of the objects in the array.
 * @param {T[]} array - The array of objects to be filtered.
 * @param {keyof T} key - The object key (property name) whose values must be unique.
 * @returns {T[]} The filtered array containing only objects with unique key values.
 */
export function filterUniqueByKey<T>(array: T[], key: keyof T): T[] {
  // 1. Create a Set to store the unique values of the key encountered so far.
  // Set is a collection of unique values, which is perfect for fast duplicate checks.
  const seenValues = new Set<T[keyof T]>();

  // 2. Use the native Array.prototype.filter() method to create a new, filtered array.
  return array.filter((item) => {
    // Access the value of the specified key from the current object.
    const keyValue = item[key];

    // 3. Check if this key value has been seen before.
    if (seenValues.has(keyValue)) {
      // If the value is already in the Set, return false.
      // This object is a duplicate and will be excluded from the result.
      return false;
    } else {
      // If the value is encountered for the first time, add it to the Set.
      seenValues.add(keyValue);
      // Return true to include the object in the resulting unique array.
      return true;
    }
  });
}
