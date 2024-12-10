import {
  API_BASE_URL,
  CREATE_ENTRY_URL,
  CREATE_JOURNAL_URL,
} from "../../constants/constants.js";
import { searchGoogle, loadFromSessionStorage } from "../../utils/utils.js";
const urlParams = new URLSearchParams(window.location.search);
const journalId = urlParams.get("journalId");

const easyMDE = new EasyMDE({
  element: document.getElementById("journal-text-area"),
});

async function fetchJournal(journalId) {
  let journal;

  let queryParams = new URLSearchParams({
    auth_token: loadFromSessionStorage("accessToken"),
    journal_id: journalId,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/read2/read_journal?${queryParams.toString()}`,
    );
    const data = await response.json();
    if (journalId) {
      journal = data;
      return journal;
    }
  } catch (error) {
    alert("Error fetching data", error);
  }

  // try {
  // 	const response = await fetch(
  // 		`${API_BASE_URL}/read2/read_journal?${queryParams.toString()}`,
  // 	);
  // 	const data = await response.json();
  // 	if (journalId) {
  // 		journal = data;
  // 		// return journal;
  // 	}
  // } catch (error) {
  // 	alert("Error fetching data", error);
  // }

  return journal;
}

if (journalId) {
  async function loadJournal() {
    const journal = await fetchJournal(journalId);
    document.getElementById("journal-title").value =
      `${journal.entries[0].journal_title}`;
    easyMDE.value(`${journal.entries[0].entry_text}`);
  }
  loadJournal();
}

async function deleteJournal(journalId) {
  let queryParams = new URLSearchParams({
    journal_id: journalId,
    auth_token: loadFromSessionStorage("accessToken"),
  });

  const deleteJournalResponse = await fetch(
    `${API_BASE_URL}/delete/delete_journal?${queryParams.toString()}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!deleteJournalResponse.ok) {
    alert("Error deleting journal", await deleteJournalResponse.json());
  } else {
    alert("Journal deleted");
    window.location.href = "../home/home.html";
  }
}

async function createJournal(journalTitle, journalEntry) {
  let queryParams = new URLSearchParams({
    journal_title: journalTitle,
    auth_token: loadFromSessionStorage("accessToken"),
  });

  const createJournalResponse = await fetch(
    `${API_BASE_URL}${CREATE_JOURNAL_URL}?${queryParams.toString()}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!createJournalResponse.ok) {
    const error = await createJournalResponse.json();
    // console.error("Error:", error);
    alert("Error creating journal", error);
  } else {
    // Parse and log the success response
    const data = await createJournalResponse.json();
    // console.log(data);

    queryParams = new URLSearchParams({
      journal_id: data.journal_id,
      auth_token: loadFromSessionStorage("accessToken"),
      page_num: 1,
      entry_text: journalEntry,
    });

    const createEntryResponse = await fetch(
      `${API_BASE_URL}${CREATE_ENTRY_URL}?${queryParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!createEntryResponse.ok) {
      const error = await createJournalResponse.json();
      // console.error("Error:", error);
      alert("Error creating journal", error);
    } else {
      // alert(`Journal saved with id: ${journalId}`);
      alert(`Journal saved!`);
      window.location.href = "../home/home.html";
    }
    return null;
  }
}

async function saveJournal(journalTitle, journalEntry) {
  if (!journalId) {
    createJournal(journalTitle, journalEntry);
  } else {
    let queryParams = new URLSearchParams({
      journal_id: journalId,
      auth_token: loadFromSessionStorage("accessToken"),
      journal_title: journalTitle,
    });
    const updateJournalResponse = await fetch(
      `${API_BASE_URL}/update/update_journal?${queryParams.toString()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    queryParams = new URLSearchParams({
      journal_id: journalId,
      page_num: 0,
      auth_token: loadFromSessionStorage("accessToken"),
      entry_text: journalEntry,
    });

    const updateEntriesResponse = await fetch(
      `${API_BASE_URL}/update/update_user_entry?${queryParams.toString()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!updateJournalResponse.ok || !updateEntriesResponse.ok) {
      const error = await updateJournalResponse.json();
      // console.error("Error:", error);
      alert(`Error: ${error}`);
    } else {
      // alert(`Journal saved with id: ${journalId}`);
      alert(`Journal saved!`);
      window.location.href = "../home/home.html";
    }
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

document.getElementById("delete-journal-btn").addEventListener("click", () => {
  if (!journalId) {
    alert("Cant delete journal which hasnt been created");
  } else {
    deleteJournal(journalId);
  }
});
