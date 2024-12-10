/* global EasyMDE */
import { searchGoogle } from "../../utils/utils.js";
const urlParams = new URLSearchParams(window.location.search);
const journalId = urlParams.get("journalId");

// DOM Elements
const addGroupBtn = document.getElementById("add-group-btn");
const dropdown = document.getElementById("group-select-dropdown");
const selectedGroupsContainer = document.getElementById(
  "selected-groups-container",
);
const saveJournalBtn = document.getElementById("save-journal-btn");

// Set to keep track of selected group IDs
const selectedGroupIds = new Set();

// console.log("Journal ID inside journal.js:", journalId);

const easyMDE = new EasyMDE({
  element: document.getElementById("journal-text-area"),
});

/**
 * Populates the dropdown menu with group data.
 *
 * @param {Object} data - The data object containing groups.
 * @param {Array} data.groups - An array of group objects.
 * @param {string} data.groups[].id - The unique identifier for the group.
 * @param {string} data.groups[].name - The name of the group.
 */
function populateDropdown(data) {
  data.groups.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = group.name;
    dropdown.appendChild(option);
  });
}

/**
 * Adds a chip for the selected group.
 *
 * @param {string} groupId - The ID of the selected group.
 * @param {string} groupName - The name of the selected group.
 */
function addGroupChip(groupId, groupName) {
  // Create chip container
  const chip = document.createElement("div");
  chip.className = "chip group-chip";
  chip.dataset.groupId = groupId;
  chip.textContent = groupName;

  // Create "X" button to remove chip
  const removeButton = document.createElement("button");
  removeButton.textContent = "X";
  removeButton.className = "remove-chip-btn";
  removeButton.addEventListener("click", () => {
    chip.remove();
    selectedGroupIds.delete(groupId);
  });

  // Append remove button to chip
  chip.appendChild(removeButton);

  // Add chip to container
  selectedGroupsContainer.appendChild(chip);
}

async function fetchJournal(journalId) {
  try {
    const response = await fetch("http://localhost:3000/journals");
    const data = await response.json();
    // console.log(data);

    // console.log("Journal ID:", journalId);

    // return data;
    if (journalId) {
      // console.log("inside if");
      let journal = data.find((journal) => journal.id === journalId);
      return journal;

      // console.log(
      // 	data.journals.find((journal) => journal.id === parseInt(journalId))
      // );
      // return data.journals.find(
      // 	(journal) => journal.id === parseInt(journalId)
      // );
    }
    // else {
    // console.log("inside else");
    // console.log(data.journals);
    // return data.journals;
    // }
  } catch (error) {
    // console.error("Error fetching data:", error);
    alert("Error fetching data", error);
  }
}

async function saveJournal(journalTitle, journalEntry) {
  // const journalTitle = document.getElementById("journal-title").value;
  // const journalEntry = easyMDE.value();
  // console.log("Journal saved:", journalTitle, journalEntry);

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

  // console.log(response);
}

if (journalId) {
  async function loadJournal() {
    const journal = await fetchJournal(journalId);

    // console.log("Journal:", journal);

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

  // console.log(results);
});

saveJournalBtn.addEventListener("click", () => {
  const journalTitle = document.getElementById("journal-title").value;
  const journalEntry = easyMDE.value();

  saveJournal(journalTitle, journalEntry);

  // console.log("Journal saved:", journalTitle, journalEntry);
});

document
  .getElementById("back-to-home-btn")
  .addEventListener("click", function () {
    window.location.href = "../home/home.html"; // Replace with your home page URL
  });

// Event Listener for Plus Button
addGroupBtn.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "none" ? "inline" : "none";
});

// Event Listener for Dropdown Selection
dropdown.addEventListener("change", () => {
  const selectedOption = dropdown.options[dropdown.selectedIndex];
  const groupId = selectedOption.value;
  if (!selectedGroupIds.has(groupId)) {
    const groupName = selectedOption.textContent;

    // Add chip for the selected group
    addGroupChip(groupId, groupName);
    selectedGroupIds.add(groupId);
  }
  // Reset dropdown
  dropdown.value = "";
  dropdown.style.display = "none";
});

// Fetch groups and populate the dropdown
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
