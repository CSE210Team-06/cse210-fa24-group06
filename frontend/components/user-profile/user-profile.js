import { API_BASE_URL } from "../../constants/constants.js";
import { getFromLocalStorage } from "../../utils/utils.js";

export class UserProfile extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <style>
          .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            background: #f0f0f0;
            padding: 5px 10px;
            border-radius: 5px;
          }
          .user-profile__username {
            font-size: 1.2rem;
            color: dodgerblue;
            text-transform: capitalize;
            font-weight: bold;
          }
          .logout-button {
            background-color: #ff4d4d;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
        <div class="user-profile" id="userProfile">
          <span class="user-profile__username" id="userFirstName"></span>
          <button class="logout-button" id="logoutButton">Log Out</button>
        </div>
      `;
  
      this.updateProfile();
  
      this.querySelector("#logoutButton").addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        window.location.reload();
      });
    }
  
    async updateProfile() {
      const token = getFromLocalStorage("accessToken");
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/user`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const userData = await response.json();
            const firstName = userData.firstName;
            this.querySelector("#userFirstName").textContent = firstName;
            this.style.display = "flex";
            document.getElementById("user-profile").textContent = firstName;
          } else {
            console.error("Failed to fetch user data");
            this.style.display = "none";
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        this.style.display = "none";
        document.getElementById("user-profile").textContent = ''; 
      }
    }
  }
  
  customElements.define("user-profile", UserProfile);
  