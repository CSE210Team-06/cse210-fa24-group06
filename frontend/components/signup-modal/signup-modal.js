/**
 * A custom HTML element for a user sign-up modal dialog.
 * Provides a form for user registration within a modal.
 *
 * @extends {HTMLElement}
 */
export class SignupModal extends HTMLElement {
  /**
   * Creates an instance of SignupModal.
   * Calls the parent HTMLElement constructor.
   */
  constructor() {
    super();
  }

  /**
   * Invoked when the custom element is appended to the DOM.
   * Initializes the modal dialog, handles user interactions, and manages form submission.
   */
  connectedCallback() {
    // Injects modal HTML and styles into the custom element
    this.innerHTML = `
          <style>
            .modal[open]::backdrop {
              backdrop-filter: blur(5px);
          }
  
          .modal {
              background: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
  
          .modal__header {
              display: flex;
              flex-direction: row;
              align-items: top;
              justify-content: space-around;
          }
  
          .modal button {
              margin-top: 15px;
          }
  
          .close-button {
              /* float: right;*/
              width: 30px;
              height: 30px;
              border-radius: 50%;
          }
  
          .form {
            display: flex;
            flex-direction: column;
          }
  
          .form > * {
            margin-bottom: 10px;
          }

          .form_error {
            display: none;
            color: red;
            font-size: 16px;
          }
          </style>
          <dialog class="modal" id="Signup-modal">
              <header class="modal__header">
                  <h2>Register New User</h2>
                  <button class="close-button" id="closeModal">&#10006;</button>
              </header>
              <form action="http://127.0.0.1:8000/signup" method="POST" class="form" id="Signup-form">
                <label for="first_name">First Name</label>
                <input type="text" id="signup-firstname" name="first_name" required />
                <label for="last_name">Last Name</label>
                <input type="text" id="signup-lastname" name="last_name" required />
                <label for="email">Email</label>
                <input type="email" id="signup-email" name="email" required /> 
                <label for="password">Password</label>
                <input type="password" id="signup-password" name="password" required />
                <button type="submit">Sign Up</button>
                <p class="form_error"></p>
              </form>
          </dialog>
        `;
    const dialog = this.querySelector("dialog");
    const closeButton = this.querySelector("#closeModal");
    const formError = this.querySelector(".form_error");
    const signupForm = document.getElementById("Signup-form");

    /**
     * Closes the modal dialog and resets the form.
     * Clears any error messages and restores scroll behavior.
     */
    closeButton.addEventListener("click", () => {
      formError.innerHTML = "";
      formError.style.display = "hidden";
      signupForm.reset();
      dialog.close();
      document.body.style.overflow = "";
    });

    /**
     * Opens the modal dialog and prevents background scrolling.
     */
    this.addEventListener("open", () => {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    });

    /**
     * Handles form submission.
     * Sends form data to the specified server endpoint using the Fetch API.
     * Displays success or error messages as appropriate.
     *
     * @param {SubmitEvent} event - The form submission event.
     */
    signupForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Collect form data from input fields
      const formData = {
        first_name: document.getElementById("signup-firstname").value,
        last_name: document.getElementById("signup-lastname").value,
        email: document.getElementById("signup-email").value,
        password: document.getElementById("signup-password").value,
      };

      try {
        // Send form data to the server
        const response = await fetch(this.action, {
          method: this.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert(
            "Signup successful, please log in with your username and password",
          );
          // Trigger the close button's click event to reset the modal
          closeButton.dispatchEvent(new Event("click"));
        } else {
          // Handle server validation errors
          return response.json().then((errorData) => {
            formError.style.display = "block";
            formError.innerHTML = `${errorData.detail}`;
          });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }
}
