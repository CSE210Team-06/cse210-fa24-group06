const openSigninModalButton = document.getElementById("openSigninModal");
const closeSigninModalButton = document.getElementById("closeModal");
const signinModal = document.getElementById("signin-modal");

openSigninModalButton.addEventListener("click", () => {
  signinModal.showModal();
  document.body.style.overflow = "hidden"; // Disable scrolling
});

closeSigninModalButton.addEventListener("click", () => {
  signinModal.close();
  document.body.style.overflow = ""; // Re-enable scrolling
});
