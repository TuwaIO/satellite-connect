/**
 * Internal function for safely retrieving and parsing data from localStorage.
 *
 * @param key - The key for localStorage
 * @returns The parsed LastConnectedWallet object or undefined if data is not found/invalid
 */
export function getParsedStorageItem<ReturnType>(key: string): ReturnType | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const item = window.localStorage.getItem(key);

  // If the item is null (not set) or an empty string, return undefined
  if (!item) {
    return undefined;
  }

  try {
    // Safe JSON parsing
    return JSON.parse(item) as ReturnType;
  } catch (error) {
    // In case of a parsing error (e.g., invalid JSON), log the error and return undefined
    console.error(`Error parsing ${key} from localStorage:`, error);
    return undefined;
  }
}
