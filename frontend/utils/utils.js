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

function getCurrentSentence(editor) {
	const cursor = editor.getCursor(); // Get the cursor position
	const doc = editor.getDoc();
	const text = doc.getValue(); // Get the full text in the editor
	const textBeforeCursor = text.slice(0, doc.indexFromPos(cursor)); // Text up to the cursor

	// Find the last sentence ending before the cursor
	const lastSentenceEnd = textBeforeCursor.lastIndexOf(".");
	// console.log("lastSentenceEnd:", lastSentenceEnd);
	// if (lastSentenceEnd === -1) return ""; // No sentence end, return empty string

	return lastSentenceEnd === -1
		? textBeforeCursor
		: textBeforeCursor.slice(lastSentenceEnd + 1).trim();
}

export async function searchGoogle(editor) {
	const query = getCurrentSentence(editor);

	// console.log("Query:", query);

	const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

	try {
		// Fetching the Google search page (this will NOT work in browsers due to CORS)
		const response = await fetch(searchUrl, {
			method: "GET",
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
			},
		});

		const htmlText = await response.text();

		// Parse the HTML text using DOMParser
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlText, "text/html");

		// Find the results (based on Google's HTML structure)
		const searchResults = doc.querySelectorAll(".tF2Cxc"); // 'tF2Cxc' is a common class for search result entries
		// console.log("Search results:", searchResults);
		// return;

		const results = [];
		searchResults.forEach((result, index) => {
			if (index > 5) {
				return;
			}
			const title = result.querySelector("h3")
				? result.querySelector("h3").innerText
				: "No title";
			const description = result.querySelector(".VwiC3b")
				? result.querySelector(".VwiC3b").innerText
				: "No description";
			const url = result.querySelector("a")
				? result.querySelector("a").href
				: "#";

			results.push({
				title,
				description,
				url,
			});
		});

		return results;
	} catch (error) {
		// console.error("Error fetching search results:", error);
		window.alert("Error fetching search results", error);
		return [];
	}
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
