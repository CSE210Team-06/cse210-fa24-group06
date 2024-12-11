import { searchGoogle } from "../../utils/utils.js";
import { API_BASE_URL, CREATE_TAG_URL } from "../../constants/constants.js";
const urlParams = new URLSearchParams(window.location.search);
const journalId = urlParams.get("journalId");

// DOM Elements
const addtagBtn = document.getElementById("add-tag-btn");
const addtagOptions = document.getElementById("add-tag-options");
const dropdown = document.getElementById("tag-select-dropdown");
const addNewtagBtn = document.getElementById("add-new-tag-btn");
const addtagModal = document.getElementById("add-tag-modal");
const selectedtagsContainer = document.getElementById(
  "selected-tags-container",
);
const saveJournalBtn = document.getElementById("save-journal-btn");

// Set to keep track of selected tag IDs
const selectedtagIds = new Set();

const easyMDE = new EasyMDE({
  element: document.getElementById("journal-text-area"),
});

/**
 * Populates the dropdown menu with tag data.
 *
 * @param {Object} data - The data object containing tags.
 * @param {Array} data.tags - An array of tag objects.
 * @param {string} data.tags[].id - The unique identifier for the tag.
 * @param {string} data.tags[].name - The name of the tag.
 */
function populateDropdown(data) {
  data.tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag.id;
    option.textContent = tag.name;
    dropdown.appendChild(option);
  });
}

/**
 * Adds a chip for the selected tag.
 *
 * @param {string} tagId - The ID of the selected tag.
 * @param {string} tagName - The name of the selected tag.
 */
function addtagChip(tagId, tagName) {
  // Create chip container
  const chip = document.createElement("div");
  chip.className = "chip tag-chip";
  chip.dataset.tagId = tagId;
  chip.textContent = tagName;

  // Create "X" button to remove chip
  const removeButton = document.createElement("button");
  removeButton.textContent = "X";
  removeButton.className = "remove-chip-btn";
  removeButton.addEventListener("click", () => {
    chip.remove();
    selectedtagIds.delete(tagId);
  });

  // Append remove button to chip
  chip.appendChild(removeButton);

  // Add chip to container
  selectedtagsContainer.appendChild(chip);
}

/**
 * Fetches the journal data from the server and returns the journal object if found.
 *
 * @param {string} journalId - The ID of the journal to fetch.
 * @returns {Promise<Object>} A promise that resolves to the journal object.
 */
async function fetchJournal(journalId) {
  try {
    const response = await fetch("http://localhost:3000/journals");
    const data = await response.json();

    if (journalId) {
      let journal = data.find((journal) => journal.id === journalId);
      return journal;
    }
  } catch (error) {
    // console.error("Error fetching data:", error);
    alert("Error fetching data", error);
  }
}

/**
 * Saves the journal to the server with the given title and entry content.
 *
 * @param {string} journalTitle - The title of the journal.
 * @param {string} journalEntry - The content of the journal entry.
 * @returns {Promise<void>}
 */
async function saveJournal(journalTitle, journalEntry) {
  let journalId = Math.floor(Math.random() * 1000).toString();

  window.alert(`Saved journal with ID: ${journalId}`);

  await fetch("http://localhost:3000/journals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: journalId,
      title: journalTitle,
      content: journalEntry,
    }),
  });
}

/**
 * Loads the journal data into the editor.
 *
 * @async
 * @function
 * @returns {Promise<void>}
 */
if (journalId) {
  async function loadJournal() {
    const journal = await fetchJournal(journalId);

    document.getElementById("journal-title").value = `${journal.title}`;
    easyMDE.value(`${journal.content}`);
  }
  loadJournal();
}

easyMDE.codemirror.on("change", async function () {
  const editor = easyMDE.codemirror;
  const results = await searchGoogle(editor);

  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = ""; // Clear any previous results

  results.forEach((result) => {
    const card = document.createElement("div");
    card.classList.add("result-card");

    const title = document.createElement("h4");
    title.innerText = result.title;

    const description = document.createElement("p");
    description.innerText = result.description;

    const link = document.createElement("a");
    link.href = result.url;
    link.innerText = "Read more";
    link.target = "_blank"; // Open in new tab

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(link);

    resultsContainer.appendChild(card);
  });
});

saveJournalBtn.addEventListener("click", () => {
  const journalTitle = document.getElementById("journal-title").value;
  const journalEntry = easyMDE.value();

  saveJournal(journalTitle, journalEntry);
});

document
  .getElementById("back-to-home-btn")
  .addEventListener("click", function () {
    window.location.href = "../home/home.html"; // Replace with your home page URL
  });

// Event Listener for Plus Button
addtagBtn.addEventListener("click", () => {
  addtagOptions.style.display =
    addtagOptions.style.display === "none" ? "inline" : "none";
});

addNewtagBtn.addEventListener("click", () => {
  addtagModal.dispatchEvent(new Event("open"));
});

addtagModal.addEventListener("open", () => {
  addtagModal.showModal();
  document.body.style.overflow = "hidden"; // Disable scrolling
});

const closeButton = document.querySelector("#closeModal");
const formError = document.querySelector(".modal .form_error");
const addtagForm = document.getElementById("add-tag-form");

// Close modal on button click
closeButton.addEventListener("click", () => {
  formError.innerHTML = "";
  formError.style.display = "hidden";
  addtagForm.reset();
  addtagModal.close();
  document.body.style.overflow = "";
});

addtagForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Create the dictionary from form inputs
  const formData = {
    auth_token: sessionStorage.getItem("accessToken"),
    tag_name: document.getElementById("tagName").value,
  };

  // Send the data to the endpoint
  const response = await fetch(
    `${API_BASE_URL}${CREATE_TAG_URL}?auth_token=${formData.auth_token}&tag_name=${formData.tag_name}`,
    {
      method: this.method,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  // Handle the response
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    getTags();
    closeButton.dispatchEvent(new Event("click"));
  } else {
    return response.json().then((errorData) => {
      formError.style.display = "block";
      formError.innerHTML = `${errorData.detail}`;
    });
  }
});

// Event Listener for Dropdown Selection
dropdown.addEventListener("change", () => {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const tagId = selectedOption.value;
  if (!selectedtagIds.has(tagId)) {
    const tagName = selectedOption.textContent;

    // Add chip for the selected tag
    addtagChip(tagId, tagName);
    selectedtagIds.add(tagId);
  }
  // Reset dropdown
  dropdown.value = "";
  addtagOptions.style.display = "none";
});

/**
 * Fetches and displays tags in the dropdown menu.
 *
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function getTags() {
  // Fetch tags and populate the dropdown
  fetch("../../mock-db/tags.json")
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
}

getTags();
