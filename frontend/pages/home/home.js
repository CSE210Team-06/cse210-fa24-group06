import { API_BASE_URL } from "../../constants/constants.js";
import { loadFromSessionStorage } from "../../utils/utils.js";

document.getElementById("create-journal-btn").addEventListener("click", () => {
  window.location.href = "../journal/journal.html";
});

document.getElementById("secrets-btn").addEventListener("click", () => {
  window.location.href = "../secrets/secrets.html";
});

document.getElementById("ai-chat-btn").addEventListener("click", () => {
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

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();

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

        matches[i].journal_title = data["entries"][0].journal_title;
      }

      resultsContainer.innerHTML = "";

      matches.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("card", "horizontal-row-card");

        card.innerHTML = `
					<a href="../journal/journal.html?journalId=${item.journal_id}" class="search_card__link">
						<div class="search_card__content">
						<h3 class="search_card__title">${item.journal_title}</h3>
						<p class="search_card__description">${item.entry_text.substring(item.char_index, item.char_index + 15)}</p>
						</div>
					</a>
					`;

        resultsContainer.appendChild(card);
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      resultsContainer.innerHTML = `<h4 id="no-search-results">No matching search results.</h4>`;
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

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

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

      matches[i].journal_title = data["entries"][0].journal_title;
    }

    const journalsContainer = document.querySelector(".journals-container");

    journalsContainer.innerHTML = "";

    matches.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card", "horizontal-row-card");

      card.innerHTML = `
          <a href="../journal/journal.html?journalId=${item.journal_id}" class="card__link">
            <div class="search_card__content">
              <h3 class="search_card__title">${item.journal_title}</h3>    
						  <p class="search_card__description">${item.entry_text.substring(item.char_index, item.char_index + item.journal_title.length - 3)}...</p>
            </div>
          </a>
        `;

      journalsContainer.appendChild(card);
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    const journalsContainer = document.querySelector(".journals-container");
    journalsContainer.innerHTML = `<h4 id="no-journal-results">No journals found.</h4>`;
  }

  addMessage(
    "Hi, I'm the AI version of Prof. Powell! I'm trained on Prof. Powell's lecture notes. You can ask me anything, but if it is of importance do ask Prof. Powell directly.",
    "bot",
  );
});

const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendButton = document.getElementById("sendButton");

/**
 * Add message to chat body
 *
 * @param {string} message - message to be added
 * @param {string} sender - user or bot
 */
function addMessage(message, sender = "user") {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message", sender);

  if (sender === "bot") {
    const imgElement = document.createElement("img");
    imgElement.classList.add("profile-pic");
    imgElement.src = "../../assets/prof.jpeg";
    imgElement.alt = "AI Prof. Powell";

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

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = message;

    messageElement.appendChild(imgElement);
    messageElement.appendChild(messageContent);
  }

  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight;
}

/**
 * Get bot response
 *
 * @param {string} message - user message
 * @returns {object} - bot response
 */
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

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    let data = await response.json();

    return data;
  } catch (error) {
    window.alert("Failed to get bot response.", error);
  }
}

/**
 * Create heading badges
 *
 * @param {array} headings - array of headings from bot response
 * @param {array} urls - array of urls from bot response
 * @returns {HTMLElement} - badge container
 */
function createHeadingBadges(headings, urls) {
  const badgeContainer = document.createElement("div");
  badgeContainer.classList.add("badge-container");

  headings.forEach((heading, index) => {
    const badge = document.createElement("a");
    badge.classList.add("badge");
    badge.href = urls[index];
    badge.target = "_blank";
    badge.textContent = heading;

    badgeContainer.appendChild(badge);
  });

  return badgeContainer;
}

sendButton.addEventListener("click", async () => {
  const message = chatInput.value.trim();

  if (message) {
    addMessage(message);
    chatInput.value = "";

    let data = await getBotResponse(message);

    const replyMessage = data.message;
    const headings = data.headings || [];
    const urls = data.urls || [];

    addMessage(replyMessage, "bot");

    if (headings.length > 0 && urls.length > 0) {
      const badgeContainer = createHeadingBadges(headings, urls);
      chatBody.appendChild(badgeContainer);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
});

chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendButton.click();
  }
});

const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", () => {
  chatBody.innerHTML = "";
  addMessage(
    "Hi, I'm the AI version of Prof. Powell! I'm trained on Prof. Powell's lecture notes. You can ask me anything, but if it is of importance do ask Prof. Powell directly.",
    "bot",
  );
});

document.getElementById("close-button").addEventListener("click", () => {
  document.getElementById("ai-chat-btn").click();
});
