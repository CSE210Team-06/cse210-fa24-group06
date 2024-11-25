export class SignupModal extends HTMLElement {
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

    document
      .getElementById("Signup-form")
      .addEventListener("submit", async function (event) {
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
            console.log("Signup successful:", await response.json());
          } else {
            console.error("Signup failed:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      });
  }
}
