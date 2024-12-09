import {
  API_BASE_URL,
  READ_JOURNAL_URL,
  CREATE_ENTRY_URL,
  CREATE_JOURNAL_URL,
} from "../../constants/constants.js";
import { searchGoogle } from "../../utils/utils.js";
const urlParams = new URLSearchParams(window.location.search);
const journalId = urlParams.get("journalId");

const easyMDE = new EasyMDE({
  element: document.getElementById("journal-text-area"),
});

async function fetchJournal(journalId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${READ_JOURNAL_URL}?auth_token=${sessionStorage.getItem("accessToken")}&journal_id=${journalId}`,
    );
    const data = await response.json();
    if (journalId) {
      let journal = data;
      return journal;
    }
  } catch (error) {
    alert("Error fetching data", error);
  }
}

if (journalId) {
  async function loadJournal() {
    const journal = await fetchJournal(journalId);
    document.getElementById("journal-title").value = `${journal.journal_title}`;
    easyMDE.value(`${journal.entries[0].entry_text}`);
  }
  loadJournal();
}

async function saveJournal(journalTitle, journalEntry) {
  const createJournalResponse = await fetch(
    `${API_BASE_URL}${CREATE_JOURNAL_URL}?auth_token=${sessionStorage.getItem("accessToken")}&journal_title=${journalTitle}`,
    {
      method: "POST",
    },
  );
  if (!createJournalResponse.ok) {
    const error = await createJournalResponse.json();
    console.error("Error:", error);
    alert(error);
  } else {
    // Parse and log the success response
    const data = await createJournalResponse.json();
    console.log(data);
    const journalId = data.journal_id;
    const createEntryResponse = await fetch(
      `${API_BASE_URL}${CREATE_ENTRY_URL}?auth_token=${sessionStorage.getItem("accessToken")}&journal_id=${journalId}&entry_text=${journalEntry}`,
      {
        method: "POST",
      },
    );
    if (!createEntryResponse.ok) {
      const error = await createJournalResponse.json();
      console.error("Error:", error);
      alert(error);
    } else {
      alert(`Journal saved with id: ${journalId}`);
      window.location.href = "../home/home.html";
    }
    return null;
  }
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

const saveJournalBtn = document.getElementById("save-journal-btn");
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
