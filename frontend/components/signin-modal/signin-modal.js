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
        </style>
        <dialog class="modal" id="signin-modal">
            <header class="modal__header">
                <h2>Sign In</h2>
                <button class="close-button" id="closeModal">&#10006;</button>
            </header>
            <div
                id="g_id_onload"
                data-client_id="YOUR_CLIENT_ID"
                data-context="signin"
                data-callback="handleCredentialResponse"
                data-auto_select="true"
            ></div>
            <div
                class="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-logo_alignment="left"
            ></div>
            <button>Create account</button>
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
