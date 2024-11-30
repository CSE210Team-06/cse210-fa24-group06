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

