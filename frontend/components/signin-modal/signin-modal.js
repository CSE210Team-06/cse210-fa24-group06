// Create a class for the element
export class SigninModal extends HTMLElement {
  constructor() {
    super(); // Call the superclass constructor
  }

  connectedCallback() {
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
        </style>
        <dialog class="modal" id="signin-modal">
            <header class="modal__header">
                <h2>Sign In</h2>
                <button class="close-button" id="closeModal">&#10006;</button>
            </header>
            <form class="form" id="signin-form">
              <label for="username">Username</label>
              <input type="text" id="signin-username" name="username" required /> 
              <label for="password">Password</label>
              <input type="password" id="signin-password" name="password" required />
              <button type="submit">Sign In</button>
            </form>
        </dialog>
      `;
    const dialog = this.querySelector("dialog");
    const closeButton = this.querySelector("#closeModal");

    // Close modal on button click
    closeButton.addEventListener("click", () => {
      dialog.close();
      document.body.style.overflow = "";
    });

    // Open modal programmatically
    this.addEventListener("open", () => {
      dialog.showModal();
      document.body.style.overflow = "hidden"; // Disable scrolling
    });
  }
}
