import { API_BASE_URL } from "../../constants/constants.js";
import { loadFromSessionStorage } from "../../utils/utils.js";

document.getElementById("create-journal-btn").addEventListener("click", () => {
  // Navigate to a blank new journal (no parameters)
  window.location.href = "../journal/journal.html";
});

document.getElementById("edit-journal-btn").addEventListener("click", () => {
  // Navigate to an existing journal edit page, passing a parameter (e.g., journalId)
  const journalId = document.getElementById("journal-id").value;
  // console.log(journalId);
  window.location.href = `../journal/journal.html?journalId=${journalId}`;
});

document
	.getElementById("search-journals-input")
	.addEventListener("input", (event) => {
		const searchTerm = event.target.value;
		const queryParams = new URLSearchParams({
			search_text: searchTerm,
			auth_token: loadFromSessionStorage("accessToken"),
		});
		// TODO
		// const response = fetch(`${${API_BASE_URL}}/search`, {
	});
