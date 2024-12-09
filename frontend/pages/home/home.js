import { API_BASE_URL } from "../../constants/constants.js";
import { loadFromSessionStorage } from "../../utils/utils.js";

document.getElementById("create-journal-btn").addEventListener("click", () => {
  // Navigate to a blank new journal (no parameters)
  window.location.href = "../journal/journal.html";
});

document.getElementById("edit-journal-btn").addEventListener("click", () => {
  // Navigate to an existing journal edit page, passing a parameter (e.g., journalId)
  const journalId = document.getElementById("journal-id").value;
  // console.log(journalId);
  window.location.href = `../journal/journal.html?journalId=${journalId}`;
});

document.getElementById("secrets-btn").addEventListener("click", () => {
  // console.log("Secrets button clicked");
  window.location.href = "../secrets/secrets.html";
});

document
  .getElementById("search-journals-input")
  .addEventListener("input", async (event) => {
    const searchTerm = event.target.value;
    // console.log(searchTerm);

    // Clear the previous search results
    // const searchedJournalsList = document.querySelector(
    // 	".searched-journals__list"
    // );
    // searchedJournalsList.innerHTML = "";

    if (searchTerm === "") {
      const searchedJournalsList = document.querySelector(
        ".searched-journals__list",
      );
      searchedJournalsList.innerHTML = "";
      return;
    }

    const queryParams = new URLSearchParams({
      search_text: searchTerm,
      auth_token: loadFromSessionStorage("accessToken"),
    });
    // console.log(queryParams);

    try {
      const response = await fetch(
        `${API_BASE_URL}/search/search_entry?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      // Check if the response is successful (status 200)
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Parse the JSON response
      const data = await response.json();
      // console.log(data); // Display the search results or use the data in the UI

      let matches = data.matches;
      for (let i = 0; i < matches.length; i++) {
        let queryParams = new URLSearchParams({
          entry_id: matches[i].entry_id,
          auth_token: loadFromSessionStorage("accessToken"),
        });
        let response = await fetch(
          `${API_BASE_URL}/read/read_entries?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        let data = await response.json();
        matches[i].entry_text = data.entry_text;

        queryParams = new URLSearchParams({
          journal_id: matches[i].journal_id,
          auth_token: loadFromSessionStorage("accessToken"),
        });
        response = await fetch(
          `${API_BASE_URL}/read2/read_journal?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        data = await response.json();
        // console.log(data);
        matches[i].journal_title = data.journal_title;
      }

      // Select the container where the cards will be displayed
      const resultsContainer = document.querySelector(
        ".searched-journals__list",
      );

      // Clear previous results
      resultsContainer.innerHTML = "";

      // Generate and append cards for each result
      matches.forEach((item) => {
        // Create a card container
        const card = document.createElement("div");
        card.classList.add("card", "horizontal-row-card");

        // Add card content
        card.innerHTML = `
          <a href="../journal/journal.html?journalId=${item.journal_id}" class="card__link">
            <div class="card__content">
              <h3 class="card__title">${item.journal_title}</h3>
              <p class="card__description">${item.entry_text.substring(item.char_index, item.char_index + 15)}</p>
            </div>
          </a>
        `;

        // Append the card to the results container
        resultsContainer.appendChild(card);
      });
    } catch (error) {
      // Handle errors (e.g., network issues or invalid responses)
      // console.error("Failed to fetch search results:", error);
      window.alert("Failed to fetch search results.", error);
    }
  });
