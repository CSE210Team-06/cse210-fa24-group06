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

/**
 * fetches journal
 *
 * @param {int} journalId - journal id
 * @returns {object} - journal
 */
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

  return journal;
}

/**
 * fetches code
 *
 * @param {int} journalId - journal id
 * @returns {object} - data with language and code
 */
async function fetchCode(journalId) {
  let queryParams = new URLSearchParams({
    auth_token: loadFromSessionStorage("accessToken"),
    journal_id: journalId,
    page_number: 0,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/read/read_codes?${queryParams.toString()}`,
    );
    let data = await response.json();

    if (!response.ok) {
      data = {
        language: "",
        code_text: "",
      };
    }

    return data;
  } catch (error) {
    alert("Error fetching code", error);
  }
}

if (journalId) {
  async function loadJournal() {
    const journal = await fetchJournal(journalId);
    document.getElementById("journal-title").value =
      `${journal.entries[0].journal_title}`;
    easyMDE.value(`${journal.entries[0].entry_text}`);
  }

  async function loadCode(journalId) {
    const codeData = await fetchCode(journalId);

    if (codeData.language !== "" || !codeData.code_text !== "") {
      document.getElementById("code-language-dropdown").value =
        `${codeData.language}`;
      document.getElementById("code-text-area").value = `${codeData.code_text}`;
    }
  }

  loadJournal();
  loadCode(journalId);
}

/**
 * deletes journal
 *
 * @param {int} journalId - journal id
 */
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

  queryParams = new URLSearchParams({
    journal_id: journalId,
    auth_token: loadFromSessionStorage("accessToken"),
    page_num: 0,
  });

  if (!deleteJournalResponse.ok) {
    alert("Error deleting journal", await deleteJournalResponse.json());
  } else {
    alert("Journal deleted");
    window.location.href = "../home/home.html";
  }
}

/**
 * creates journal
 *
 * @param {string} journalTitle - journal title
 * @param {string} journalEntry - journal entry
 * @param {string} codeLanguage - code language
 * @param {string} codeContent - code content
 */
async function createJournal(
  journalTitle,
  journalEntry,
  codeLanguage,
  codeContent,
) {
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

    alert("Error creating journal", error);
  } else {
    const data = await createJournalResponse.json();

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

      alert("Error creating journal", error);
    }

    queryParams = new URLSearchParams({
      journal_id: data.journal_id,
      auth_token: loadFromSessionStorage("accessToken"),
      language: codeLanguage,
      code_text: codeContent,
    });
    const createCodeResponse = await fetch(
      `${API_BASE_URL}/create/create_codes?${queryParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!createCodeResponse.ok) {
      const error = await createJournalResponse.json();
      alert("Error creating journal", error);
    } else {
      alert(`Journal saved!`);
      window.location.href = "../home/home.html";
    }

    return null;
  }
}

/**
 * saves journal
 *
 * @param {string} journalTitle - journal title
 * @param {string} journalEntry - journal entry
 * @param {string} codeLanguage - code language
 * @param {string} codeContent - code content
 */
async function saveJournal(
  journalTitle,
  journalEntry,
  codeLanguage,
  codeContent,
) {
  if (!journalId) {
    createJournal(journalTitle, journalEntry, codeLanguage, codeContent);
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
      Language: codeLanguage || "",
      code_text: codeContent || "",
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

    queryParams = new URLSearchParams({
      journal_id: journalId,
      auth_token: loadFromSessionStorage("accessToken"),
      code_text: codeContent,
      language: codeLanguage,
      page_num: 0,
    });
    const updateCodeResponse = await fetch(
      `${API_BASE_URL}/update/update_user_code?${queryParams.toString()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    let createCodeResponse;
    if (!updateCodeResponse.ok) {
      queryParams = new URLSearchParams({
        journal_id: journalId,
        auth_token: loadFromSessionStorage("accessToken"),
        language: codeLanguage,
        code_text: codeContent,
      });
      createCodeResponse = await fetch(
        `${API_BASE_URL}/create/create_codes?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!createCodeResponse.ok) {
        const error = await createCodeResponse.json();
        alert("Error creating code", error);
      }
    }

    if (!updateJournalResponse.ok || !updateEntriesResponse.ok) {
      if (
        updateCodeResponse.ok ||
        (createCodeResponse && createCodeResponse.ok)
      ) {
        alert(
          "Error: Issues updating the journal or entries, but code was updated successfully.",
        );
      } else {
        alert("Error: Failed to update the journal, entries, and code.");
      }
    } else {
      alert("Journal saved!");
      window.location.href = "../home/home.html";
    }
  }
}

easyMDE.codemirror.on("change", async function () {
  const editor = easyMDE.codemirror;
  const results = await searchGoogle(editor);

  const resultsContainer = document.getElementById("results-container");
  resultsContainer.innerHTML = "";

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
    link.target = "_blank";

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(link);

    resultsContainer.appendChild(card);
  });
});

const saveJournalBtn = document.getElementById("save-journal-btn");
saveJournalBtn.addEventListener("click", () => {
  const journalTitle = document.getElementById("journal-title").value;
  const journalEntry = easyMDE.value();
  const codeLanguage = document.getElementById("code-language-dropdown").value;
  const codeContent = document.getElementById("code-text-area").value;

  const finalCodeLanguage = codeLanguage !== "" ? codeLanguage : null;
  const finalCodeContent = codeContent.trim() !== "" ? codeContent : null;

  saveJournal(journalTitle, journalEntry, finalCodeLanguage, finalCodeContent);
});

document
  .getElementById("back-to-home-btn")
  .addEventListener("click", function () {
    window.location.href = "../home/home.html";
  });

document.getElementById("delete-journal-btn").addEventListener("click", () => {
  if (!journalId) {
    alert("Cant delete journal which hasnt been created");
  } else {
    deleteJournal(journalId);
  }
});
