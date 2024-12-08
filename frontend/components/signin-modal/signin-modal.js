/**
 * A custom HTML element for a users sign-in modal dialog.
 * Provides form submission functionality within a modal user interface.
 *
 * @extends {HTMLElement}
 */
export class SigninModal extends HTMLElement {
  /**
   * Creates an instance of SigninModal by calling the parent HTMLElement constructor.
   */
  constructor() {
    super();
  }

  /**
   * Invoked when the custom element is appended to the DOM.
   * Initializes the modal dialog, handles event listeners for user interactions,
   * and manages form submission with client-side validation and server communication.
   */
  connectedCallback() {
    // Inject modal HTML and styles into the component
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
        <dialog class="modal" id="signin-modal">
            <header class="modal__header">
                <h2>Sign In</h2>
                <button class="close-button" id="closeModal">&#10006;</button>
            </header>
            <form action="http://127.0.0.1:8000/login" method="POST" class="form" id="signin-form">
              <label for="email">Email</label>
              <input type="email" id="signin-email" name="email" required /> 
              <label for="password">Password</label>
              <input type="password" id="signin-password" name="password" required />
              <button type="submit">Sign In</button>
              <p class="form_error"></p>
            </form>
        </dialog>
      `;
    const dialog = this.querySelector("dialog");
    const closeButton = this.querySelector("#closeModal");
    const formError = this.querySelector(".form_error");
    const signinForm = document.getElementById("signin-form");

    /**
     * Closes the modal dialog and resets the form.
     * Clears any existing error messages and restores scroll behavior.
     */
    closeButton.addEventListener("click", () => {
      formError.innerHTML = "";
      formError.style.display = "hidden";
      signinForm.reset();
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
     */
    signinForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      // Gather form data
      const formData = {
        email: document.getElementById("signin-email").value,
        password: document.getElementById("signin-password").value,
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
          console.log("Signup successful:", await response.json());
        } else {
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
