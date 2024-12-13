/**
 * saves to session storage
 *
 * @param {string} key - key to be stored
 */
export function saveToSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

/**
 * loads from session storage
 *
 * @param {string} key - key to be retrieved
 * @returns {string} - string of last sentence.
 */
export function loadFromSessionStorage(key) {
  const value = sessionStorage.getItem(key);
  return value;
}

/**
 * deletes from session storage
 *
 * @param {string} key - The easyMDE editor instance.
 */
export function deleteFromSessionStorage(key) {
  sessionStorage.removeItem(key);
}

/**
 * Searches google using the current sentence as the query.
 *
 * @param {editor} editor - The easyMDE editor instance.
 * @returns {string} - string of last sentence.
 */
function getCurrentSentence(editor) {
  const cursor = editor.getCursor();
  const doc = editor.getDoc();
  const text = doc.getValue();
  const textBeforeCursor = text.slice(0, doc.indexFromPos(cursor));

  const lastSentenceEnd = textBeforeCursor.lastIndexOf(".");

  return lastSentenceEnd === -1
    ? textBeforeCursor
    : textBeforeCursor.slice(lastSentenceEnd + 1).trim();
}

/**
 * Searches google using the current sentence as the query.
 *
 * @param {editor} editor - The easyMDE editor instance.
 * @returns {array} - An array of search results.
 */
export async function searchGoogle(editor) {
  const query = getCurrentSentence(editor);

  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const htmlText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const searchResults = doc.querySelectorAll(".tF2Cxc");

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
