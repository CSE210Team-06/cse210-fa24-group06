import { API_BASE_URL } from "../../constants/constants.js";
import { loadFromSessionStorage } from "../../utils/utils.js";

async function fetchUserProfile() {
  const token = loadFromSessionStorage("accessToken");
  const userFirstNameElement = document.getElementById("user-first-name");

  if (!token) {
    // console.error("No access token found. Redirecting to sign-in.");
    window.alert("No access token found. Please sign in again.");
    window.location.href = "../../index.html";
    return;
  }

  try {
    const queryParams = new URLSearchParams({
      auth_token: loadFromSessionStorage("accessToken"),
    });

    const response = await fetch(
      `${API_BASE_URL}/get_user/user_details?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile. Please sign in again.");
    }

    const userData = await response.json();

    userFirstNameElement.textContent = userData.first_name;
  } catch (error) {
    // console.error("Error fetching user profile:", error);
    window.alert("Error fetching user profile. Please sign in again.", error);
    window.location.href = "../../index.html";
    window.alert("Error loading user profile. Please sign in again.");
    window.location.href = "../../index.html";
  }
}

window.addEventListener("DOMContentLoaded", fetchUserProfile);

document.getElementById("Logout").addEventListener("click", () => {
  sessionStorage.removeItem("accessToken");
  window.location.href = "../../index.html";
});
