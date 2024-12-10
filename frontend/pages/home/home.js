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

const dropdown = document.getElementById("journal-group-select");
/**
 * Populates a dropdown menu with group data.
 *
 * @param {Object} data - The data object containing groups.
 * @param {Array} data.groups - An array of group objects.
 * @param {string} data.groups[].id - The unique identifier for the group.
 * @param {string} data.groups[].name - The name of the group.
 */
function populateDropdown(data) {
  data.groups.forEach((group, index) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    dropdown.appendChild(option);

    // Select the first group by default
    if (index === 0) {
      dropdown.value = group.id;
    }
  });
}

/**
 * Fetches group data from a mock database and populates the dropdown menu.
 */
fetch("../../mock-db/groups.json")
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
