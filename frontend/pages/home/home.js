import { API_BASE_URL } from "../../constants/constants.js";
import { GET_ALL_TAGS_URL } from "../../constants/constants.js";

/**
 * Event listener for "Create Journal" button.
 * Navigates to a blank new journal page.
 */
document.getElementById("create-journal-btn").addEventListener("click", () => {
  // Navigate to a blank new journal (no parameters)
  window.location.href = "../journal/journal.html";
});

/**
 * Event listener for "Edit Journal" button.
 * Navigates to an existing journal edit page, passing the journalId as a query parameter.
 */
document.getElementById("edit-journal-btn").addEventListener("click", () => {
  // Navigate to an existing journal edit page, passing a parameter (e.g., journalId)
  const journalId = document.getElementById("journal-id").value;
  // console.log(journalId);
  window.location.href = `../journal/journal.html?journalId=${journalId}`;
});

/**
 * Event listener for "Secrets" button.
 * Navigates to the secrets page.
 */
document.getElementById("secrets-btn").addEventListener("click", () => {
  window.location.href = "../secrets/secrets.html";
});

const dropdown = document.getElementById("tag-select");
/**
 * Populates a dropdown menu with tag data.
 *
 * @param {Object} data - The data object containing tags.
 * @param {Array} data.tags - An array of tag objects.
 * @param {string} data.tags[].id - The unique identifier for the tag.
 * @param {string} data.tags[].name - The name of the tag.
 */
function populateDropdown(data) {
  data.tags.forEach((tag, index) => {
    const option = document.createElement("option");
    option.value = tag.tag_id;
    option.textContent = tag.tag_name;
    dropdown.appendChild(option);

    // Select the first tag by default
    if (index === 0) {
      dropdown.value = tag.id;
    }
  });
}

/**
 * Fetches tag data from a mock database and populates the dropdown menu.
 */
fetch(
  `${API_BASE_URL}${GET_ALL_TAGS_URL}?auth_token=${sessionStorage.getItem("accessToken")}`,
)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    populateDropdown(data);
  })
  .catch((error) => {
    console.error("Error loading JSON data:", error);
  });
