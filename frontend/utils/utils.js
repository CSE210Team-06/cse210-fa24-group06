export function saveToSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
  // console.log(`Saved to Session storage -> ${key}: ${value}`);
  window.alert(`Saved to Session storage -> ${key}: ${value}`);
}

export function loadFromSessionStorage(key) {
  const value = sessionStorage.getItem(key);
  // console.log(`Loaded from Session storage -> ${key}: ${value}`);
  window.alert(`Loaded from Session storage -> ${key}: ${value}`);
  return value;
}

export function deleteFromSessionStorage(key) {
  sessionStorage.removeItem(key);
  // console.log(`Deleted from Session storage -> ${key}`);
  window.alert(`Deleted from Session storage -> ${key}`);
}
