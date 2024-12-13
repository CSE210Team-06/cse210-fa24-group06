import { API_BASE_URL } from "../../constants/constants.js";
import { saveToSessionStorage } from "../../utils/utils.js";

export class SigninModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <style>
          .modal[open]::backdrop {
            backdrop-filter: blur(5px);
        }

        .modal {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			overflow: hidden;
        }
        .modal__header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
		.header{
		  padding: 0;
		  color: var(--theme-dark);
		  font-size: 7vh;
		}
        .modal button {
            margin-top: 15px;
        }

        .close-button {
            width: 30px;
            height: 30px;
        }

        .form {
          display: flex;
          flex-direction: column;
		  height: 55vh;
		  width: 50vh;
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
                <h2 class="header">Sign In</h2>
                <button class="close-button" id="closeModal">&#10006;</button>
            </header>
            <form action="${API_BASE_URL}/login" method="POST" class="form" id="signin-form">
              <label for="email">Email</label>
              <input type="email" class="signin-email" id="signin-email" name="email" required /> 
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

    closeButton.addEventListener("click", () => {
      formError.innerHTML = "";
      formError.style.display = "hidden";
      signinForm.reset();
      dialog.close();
      document.body.style.overflow = "";
    });

    this.addEventListener("open", () => {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    });

    signinForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = {
        email: document.getElementById("signin-email").value,
        password: document.getElementById("signin-password").value,
      };

      try {
        const response = await fetch(this.action, {
          method: this.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          saveToSessionStorage("accessToken", data.access_token);

          window.location.href = "./pages/home/home.html";
        } else {
          return response.json().then((errorData) => {
            formError.style.display = "block";
            formError.innerHTML = `${errorData.detail}`;
          });
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        window.alert("Error signing in.");
      }
    });
  }
}
