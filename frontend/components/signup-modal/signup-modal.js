import { API_BASE_URL } from "../../constants/constants.js";

export class SignupModal extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `
          <style>
          :root {
            --theme-dark: #b46dd2;
            --clickbutton-dark: rgb(149, 36, 198);
            --border-dark: #e6b2fd;
          }
          .modal[open]::backdrop {
              backdrop-filter: blur(5px);
          }
  
          .modal {
              background: var(--bg-dark);
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              text-align: center;
              border: 0.5vh solid var(--theme-dark);
              padding: 60px; 
              padding-bottom:  0;
              max-width: 500px;
              width: 100%;
              height: 70vh;
          }
          .modal__header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              position: relative;
          }
  
          .close-button {
            border: none;
            right: 0;
            background-color: transparent;
            color: var(--theme-dark); 
            font-size: 50px; 
            cursor: pointer; 
            display: flex;
            position: absolute;
            margin-left: 6%;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
          .form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
  		    .header_2{
            font-size: 4vh;
            color: var(--theme-dark);
            flex-grow: 1;
            text-align: left;
            padding:0;
		      }
          .form > * {
            margin-bottom: 10px;
          }
          .form label{
            padding: 0;
            color: var(--theme-dark);
            text-align: left;
          }
          .form input {
            background-color: var(--bg-dark);
            color: white;
            border: 0.2vh solid var(--theme-dark);
            border-radius: 6px;
            padding: 10px;
            width: 98%;
            font-size:large;
          }
          .form input:focus {
            outline: none;
            border: 0.2vh solid var(--theme-dark);
          }
          .form button{
            background-color: var(--clickbutton-dark);
            color: white;
            border: 0.2vh solid var(--clickbutton-dark);
            border-radius: 5px;
            padding: 11.5px 22px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            align-self: center;
            width: auto;
            margin-bottom: 20px;
          }
          .form_error {
            display: none;
            color: red;
            font-size: 16px;
          }
          </style>
          <dialog class="modal" id="Signup-modal">
              <header class="modal__header">
                  <h2 class="header_2">Register New User</h2>
                  <button class="close-button" id="closeModal">&#10006;</button>
              </header>
              <form action="${API_BASE_URL}/signup" method="POST" class="form" id="Signup-form">
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

		// Close modal on button click
		closeButton.addEventListener("click", () => {
			formError.innerHTML = "";
			formError.style.display = "hidden";
			signupForm.reset();
			dialog.close();
			document.body.style.overflow = "";
		});

		// Open modal programmatically
		this.addEventListener("open", () => {
			dialog.showModal();
			document.body.style.overflow = "hidden"; // Disable scrolling
		});

		signupForm.addEventListener("submit", async function (event) {
			event.preventDefault(); // Prevent the default form submission

			// Create the dictionary from form inputs
			const formData = {
				first_name: document.getElementById("signup-firstname").value,
				last_name: document.getElementById("signup-lastname").value,
				email: document.getElementById("signup-email").value,
				password: document.getElementById("signup-password").value,
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
					alert(
						"Signup successful, please log in with your username and password"
					);
					closeButton.dispatchEvent(new Event("click"));
				} else {
					return response.json().then((errorData) => {
						formError.style.display = "block";
						formError.innerHTML = `${errorData.detail}`;
					});
				}
			} catch (error) {
				// console.error("Error:", error);
				alert("An error occurred while signing up.", error);
			}
		});
	}
}
