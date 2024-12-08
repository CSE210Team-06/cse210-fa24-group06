import { API_BASE_URL } from "../../constants/constants.js";
import { saveToSessionStorage } from "../../utils/utils.js";

// console.log(API_BASE_URL);

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
            <form action="${API_BASE_URL}/login" method="POST" class="form" id="signin-form">
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

    // Close modal on button click
    closeButton.addEventListener("click", () => {
      formError.innerHTML = "";
      formError.style.display = "hidden";
      signinForm.reset();
      dialog.close();
      document.body.style.overflow = "";
    });

    // Open modal programmatically
    this.addEventListener("open", () => {
      dialog.showModal();
      document.body.style.overflow = "hidden"; // Disable scrolling
    });

    signinForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent the default form submission

      // Create the dictionary from form inputs
      const formData = {
        email: document.getElementById("signin-email").value,
        password: document.getElementById("signin-password").value,
      };

      // Send the data to the endpoint
      try {
        const response = await fetch(this.action, {
          method: this.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Handle the response
        if (response.ok) {
          // console.log("Signup successful:", await response.json());
          window.alert("Sign in successful!");
          saveToSessionStorage("accessToken", response.json().accessToken);
          // navigate to the home page
          window.location.href = "./pages/home/home.html";
        } else {
          return response.json().then((errorData) => {
            formError.style.display = "block";
            formError.innerHTML = `${errorData.detail}`;
          });
        }
      } catch (error) {
        // console.error("Error:", error);
        window.alert("Sign in failed!", error);
      }
    });
  }
}
