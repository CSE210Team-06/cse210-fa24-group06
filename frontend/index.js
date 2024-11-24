const openSigninModalButton = document.getElementById("openSigninModal");
const modal = document.getElementById("signin-modal");
modal.dispatchEvent(new Event("open"));
openSigninModalButton.addEventListener("click", () => {
  const modal = document.getElementById("signin-modal");
  modal.dispatchEvent(new Event("open"));
});
