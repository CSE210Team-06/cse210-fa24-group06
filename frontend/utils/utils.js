export function saveToLocalStorage(key, value) {
	sessionStorage.setItem(key, value);
	console.log(`Saved to local storage -> ${key}: ${value}`);

	// sessionStorage.setItem('accessToken', token);
	// console.log('Access token saved:', token);
}

export function loadFromLocalStorage(key) {
	const value = sessionStorage.getItem(key);
	console.log(`Loaded from local storage -> ${key}: ${value}`);
	return value;
}

export function deleteFromLocalStorage(key) {
	sessionStorage.removeItem(key);
	console.log(`Deleted from local storage -> ${key}`);
}
