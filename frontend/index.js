const openSigninModalButton = document.getElementById("openSigninModal");
const openSignupModalButton = document.getElementById("openSignupModal");

openSigninModalButton.addEventListener("click", () => {
	const modal = document.getElementById("signin-modal");
	modal.dispatchEvent(new Event("open"));
});

openSignupModalButton.addEventListener("click", () => {
	const modal = document.getElementById("signup-modal");
	modal.dispatchEvent(new Event("open"));
});

document.getElementById("create-journal-btn").addEventListener("click", () => {
	// Navigate to a blank new journal (no parameters)
	window.location.href = "./pages/journal/journal.html";
});

document.getElementById("edit-journal-btn").addEventListener("click", () => {
	// Navigate to an existing journal edit page, passing a parameter (e.g., journalId)
	const journalId = document.getElementById("journal-id").value;
	// console.log(journalId);
	window.location.href = `./pages/journal/journal.html?journalId=${journalId}`;
});
