/**
 * Script that attaches event listeners for common buttons.
 */

// Get references to the buttons that open the sign-in and sign-up modals
const openSigninModalButton = document.getElementById("openSigninModal");
const openSignupModalButton = document.getElementById("openSignupModal");

/**
 * Event listener for the "Sign In" button.
 * Dispatches an "open" event to display the sign-in modal dialog.
 */
openSigninModalButton.addEventListener("click", () => {
  const modal = document.getElementById("signin-modal");
  modal.dispatchEvent(new Event("open"));
});

/**
 * Event listener for the "Sign Up" button.
 * Dispatches an "open" event to display the sign-up modal dialog.
 */
openSignupModalButton.addEventListener("click", () => {
  const modal = document.getElementById("signup-modal");
  modal.dispatchEvent(new Event("open"));
});
