/**
 * Saves a key-value pair to session storage.
 *
 * @param {string} key - The key to identify the stored value.
 * @param {string} value - The value to store, must be a string.
 *
 * This function uses the `sessionStorage.setItem` method to save a key-value
 * pair to the session storage. It also logs the saved key and value to the console.
 */
export function saveToSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
  console.log(`Saved to local storage -> ${key}: ${value}`);
}

/**
 * Loads a value from session storage based on the provided key.
 *
 * @param {string} key - The key of the stored value to retrieve.
 * @returns {string|null} - The value associated with the key, or null if the key does not exist.
 *
 * This function retrieves the value associated with the given key from session storage
 * using `sessionStorage.getItem`. It logs the retrieved key and value to the console.
 */
export function loadFromSessionStorage(key) {
  const value = sessionStorage.getItem(key);
  console.log(`Loaded from local storage -> ${key}: ${value}`);
  return value;
}

/**
 * Deletes a key-value pair from session storage.
 *
 * @param {string} key - The key of the stored value to delete.
 *
 * This function removes the key-value pair associated with the given key
 * from session storage using `sessionStorage.removeItem`. It logs the deleted key to the console.
 */
export function deleteFromSessionStorage(key) {
  sessionStorage.removeItem(key);
  console.log(`Deleted from local storage -> ${key}`);
}

/**
 * Retrieves a value from session storage without logging.
 *
 * @param {string} key - The key of the stored value to retrieve.
 * @returns {string|null} - The value associated with the key, or null if the key does not exist.
 *
 * This function provides a minimal way to fetch values from session storage
 * using `sessionStorage.getItem`, without logging any information to the console.
 */
export function getFromSessionStorage(key) {
  return sessionStorage.getItem(key);
}
