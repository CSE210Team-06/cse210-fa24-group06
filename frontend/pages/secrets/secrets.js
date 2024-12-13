/* global CryptoJS */
let encryptionKey = "";

/**
 * Sets the encryption key and loads the secrets from local storage
 * when the "Set Key" button is clicked
 * @returns {void}
 */
function setEncryptionKey() {
  encryptionKey = document.getElementById("encryption-key").value;
  if (encryptionKey) {
    loadSecretsFromLocalStorage();
  } else {
    alert("Please enter a valid password.");
  }
}

/**
 * Encrypts the given text using AES encryption
 * @param {string} text - The text to be encrypted
 * @returns {string} - The encrypted text
 */
function encryptText(text) {
  return CryptoJS.AES.encrypt(text, encryptionKey).toString();
}

/**
 * Decrypts the given encrypted text using AES decryption
 * @param {string} encryptedText - The encrypted text to be decrypted
 * @returns {string} - The decrypted text
 */
function decryptText(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Saves a new secret to local storage
 * @param {string} name - The name of the secret
 * @param {string} description - The description of the secret
 * @param {string} value - The value of the secret
 * @returns {void}
 */
function saveSecretToLocalStorage(name, description, value) {
  const encryptedValue = encryptText(value);
  const secrets = JSON.parse(localStorage.getItem("secrets")) || [];
  secrets.push({ name, description, value: encryptedValue });
  localStorage.setItem("secrets", JSON.stringify(secrets));
}

/**
 * Deletes a secret from local storage
 * @param {number} index - The index of the secret to be deleted
 * @returns {void}
 */
function deleteSecretFromLocalStorage(index) {
  const secrets = JSON.parse(localStorage.getItem("secrets")) || [];
  secrets.splice(index, 1);
  localStorage.setItem("secrets", JSON.stringify(secrets));
  loadSecretsFromLocalStorage();
}

/**
 * Loads secrets from local storage
 * @returns {void}
 */
function loadSecretsFromLocalStorage() {
  const secrets = JSON.parse(localStorage.getItem("secrets")) || [];
  const secretsTableBody = document
    .getElementById("secrets-table")
    .getElementsByTagName("tbody")[0];
  secretsTableBody.innerHTML = "";

  secrets.forEach((secret, index) => {
    const decryptedValue = decryptText(secret.value);

    const row = secretsTableBody.insertRow();
    row.innerHTML = `
            <td>${secret.name}</td>
            <td>${secret.description}</td>
            <td>
                <span class="hidden-value">${"•".repeat(decryptedValue.length)}</span>
                <span class="actual-value" style="display:none;">${decryptedValue}</span>
            </td>
            <td>
                <button class="toggle-visibility-button">👁️</button>
                <button class="copy-button">📋</button>
                <button class="delete-button" data-index="${index}">🗑️</button>
            </td>
        `;

    row
      .querySelector(".toggle-visibility-button")
      .addEventListener("click", function () {
        const actualValue = row.querySelector(".actual-value");
        const hiddenValue = row.querySelector(".hidden-value");

        if (actualValue.style.display === "none") {
          actualValue.style.display = "inline";
          hiddenValue.style.display = "none";
        } else {
          actualValue.style.display = "none";
          hiddenValue.style.display = "inline";
        }
      });

    row.querySelector(".delete-button").addEventListener("click", function () {
      deleteSecretFromLocalStorage(index);
    });

    row.querySelector(".copy-button").addEventListener("click", function () {
      navigator.clipboard
        .writeText(decryptedValue)
        .then(() => alert("Copied to clipboard!"))
        .catch((err) => alert("Failed to copy: " + err));
    });
  });
}

document
  .getElementById("add-secret-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("secret-name").value;
    const description = document.getElementById("secret-description").value;
    const value = document.getElementById("secret-value").value;

    saveSecretToLocalStorage(name, description, value);

    document.getElementById("add-secret-form").reset();

    loadSecretsFromLocalStorage();
  });

document
  .getElementById("back-to-home-btn")
  .addEventListener("click", function () {
    window.location.href = "../home/home.html";
  });

window.onload = function () {
  loadSecretsFromLocalStorage();
};

document
  .getElementById("set-key-button")
  .addEventListener("click", setEncryptionKey);
