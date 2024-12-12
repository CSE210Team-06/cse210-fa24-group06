import { API_BASE_URL } from "../../constants/constants.js";
import { loadFromSessionStorage } from "../../utils/utils.js";

document.getElementById("create-journal-btn").addEventListener("click", () => {
  // Navigate to a blank new journal (no parameters)
  window.location.href = "../journal/journal.html";
});

// document.getElementById("edit-journal-btn").addEventListener("click", () => {
// 	// Navigate to an existing journal edit page, passing a parameter (e.g., journalId)
// 	const journalId = document.getElementById("journal-id").value;
// 	// console.log(journalId);
// 	window.location.href = `../journal/journal.html?journalId=${journalId}`;
// });

document.getElementById("secrets-btn").addEventListener("click", () => {
  // console.log("Secrets button clicked");
  window.location.href = "../secrets/secrets.html";
});

document.getElementById("ai-chat-btn").addEventListener("click", () => {
  // console.log("Secrets button clicked");
  // window.location.href = "../ai-prof/ai-prof.html";

  if (document.getElementById("right-side-panel").style.display === "block") {
    document.getElementById("right-side-panel").style.display = "none";
  } else {
    document.getElementById("right-side-panel").style.display = "block";
  }
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

    const resultsContainer = document.querySelector(".searched-journals__list");

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
          `${API_BASE_URL}/read2/read_entries?${queryParams.toString()}`,
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
        // matches[i].journal_title = data.journal_title;
        matches[i].journal_title = data["entries"][0].journal_title;
      }

      // Select the container where the cards will be displayed
      // const resultsContainer = document.querySelector(
      // 	".searched-journals__list"
      // );

      // Clear previous results
      resultsContainer.innerHTML = "";

      // Generate and append cards for each result
      matches.forEach((item) => {
        // Create a card container
        const card = document.createElement("div");
        card.classList.add("card", "horizontal-row-card");

        // Add card content
        card.innerHTML = `
					<a href="../journal/journal.html?journalId=${item.journal_id}" class="search_card__link">
						<div class="search_card__content">
						<h3 class="search_card__title">${item.journal_title}</h3>
						<p class="search_card__description">${item.entry_text.substring(item.char_index, item.char_index + 15)}</p>
						</div>
					</a>
					`;

        // Append the card to the results container
        resultsContainer.appendChild(card);
      });
    } catch (error) {
      // Handle errors (e.g., network issues or invalid responses)
      // console.error("Failed to fetch search results:", error)
      // window.alert("Failed to fetch search results.", error);
      resultsContainer.innerHTML = `Failed to fetch search results.\n${error}`;
    }
  });

document.addEventListener("DOMContentLoaded", async () => {
  let matches = [];

  const queryParams = new URLSearchParams({
    search_text: "",
    auth_token: loadFromSessionStorage("accessToken"),
  });

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

    matches = data.matches;
    for (let i = 0; i < matches.length; i++) {
      let queryParams = new URLSearchParams({
        entry_id: matches[i].entry_id,
        auth_token: loadFromSessionStorage("accessToken"),
      });
      let response = await fetch(
        `${API_BASE_URL}/read2/read_entries?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      let data = await response.json();
      matches[i].entry_text = data.entry_text;
      // console.log("after entry_text");
      // console.log(matches[i]);

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
      // console.log("data entries");
      // console.log(data["entries"][0].journal_title);

      matches[i].journal_title = data["entries"][0].journal_title;
      // console.log("after journal_title");
      // console.log(matches[i]);
    }

    // Select the container where the cards will be displayed
    const journalsContainer = document.querySelector(".journals-container");

    // Clear previous results
    journalsContainer.innerHTML = "";

    // Generate and append cards for each result
    matches.forEach((item) => {
      // Create a card container
      const card = document.createElement("div");
      card.classList.add("card", "horizontal-row-card");

      // console.log(item);

      // Add card content
      card.innerHTML = `
          <a href="../journal/journal.html?journalId=${item.journal_id}" class="card__link">
            <div class="search_card__content">
              <h3 class="search_card__title">${item.journal_title}</h3>    
						  <p class="search_card__description">${item.entry_text.substring(item.char_index, item.char_index + item.journal_title.length - 3)}...</p>
            </div>
          </a>
        `;

      // Append the card to the results container
      journalsContainer.appendChild(card);
    });
  } catch (error) {
    // Handle errors (e.g., network issues or invalid responses)
    // console.error("Failed to fetch search results:", error);
    window.alert("Failed to fetch journals.", error);
  }

  addMessage(
    "Hi, I'm the AI version of Prof. Powell! I'm trained on Prof. Powell's lecture notes. You can ask me anything, but if it is of importance do ask Prof. Powell directly.",
    "bot",
  );
});

const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

// Function to add a message to the chat
function addMessage(message, sender = "user") {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", sender);
  // messageElement.textContent = message;

  // Add profile picture if provided (for bot messages)
  if (sender === "bot") {
    const imgElement = document.createElement("img");
    imgElement.classList.add("profile-pic");
    imgElement.src = "../../assets/prof.jpeg";
    imgElement.alt = "AI Prof. Powell";

    // Add the image before the message text
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = message;

    messageElement.appendChild(imgElement);
    messageElement.appendChild(messageContent);
  } else {
    const imgElement = document.createElement("img");
    imgElement.classList.add("profile-pic");
    imgElement.src = "../../assets/user.jpg";
    imgElement.alt = "User";

    // Add the image before the message text
    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = message;

    messageElement.appendChild(imgElement);
    messageElement.appendChild(messageContent);
  }

  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the latest message
}

async function getBotResponse(message) {
  let queryParams = new URLSearchParams({
    user_message: message,
  });

  try {
    const response = await fetch(
      `${API_BASE_URL}/ai_prof/get_prof_response?${queryParams.toString()}`,
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

    let data = await response.json();

    // console.log(data);

    return data;
  } catch (error) {
    // Handle errors (e.g., network issues or invalid responses)
    // console.error("Failed to fetch search results:", error);
    window.alert("Failed to get bot response.", error);
  }
}

function createHeadingBadges(headings, urls) {
  const badgeContainer = document.createElement("div");
  badgeContainer.classList.add("badge-container");

  headings.forEach((heading, index) => {
    const badge = document.createElement("a");
    badge.classList.add("badge");
    badge.href = urls[index];
    badge.target = "_blank"; // Open in new tab
    badge.textContent = heading;

    badgeContainer.appendChild(badge);
  });

  return badgeContainer;
}

// Handle send button click
sendButton.addEventListener("click", async () => {
  const message = chatInput.value.trim();
  // console.log(message);
  if (message) {
    addMessage(message);
    chatInput.value = "";
    // setTimeout(() => addMessage("This is a reply from the bot.", "bot"), 1000); // Simulate bot response

    let data = await getBotResponse(message);

    const replyMessage = data.message;
    const headings = data.headings || [];
    const urls = data.urls || [];

    addMessage(replyMessage, "bot");

    if (headings.length > 0 && urls.length > 0) {
      const badgeContainer = createHeadingBadges(headings, urls);
      chatBody.appendChild(badgeContainer);
      chatBody.scrollTop = chatBody.scrollHeight; // Scroll to the latest message
    }
  }
});

// Handle Enter key press in input
chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

const clearButton = document.getElementById("clearButton");

// Handle clear button click
clearButton.addEventListener("click", () => {
  chatBody.innerHTML = ""; // Clear all chat messages
  addMessage(
    "Hi, I'm the AI version of Prof. Powell! I'm trained on Prof. Powell's lecture notes. You can ask me anything, but if it is of importance do ask Prof. Powell directly.",
    "bot",
  );
});

document.getElementById("close-button").addEventListener("click", () => {
  document.getElementById("ai-chat-btn").click();
});
