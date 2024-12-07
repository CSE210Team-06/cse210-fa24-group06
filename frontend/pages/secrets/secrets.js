/* global CryptoJS */
let encryptionKey = "";

function setEncryptionKey() {
  encryptionKey = document.getElementById("encryption-key").value;
  if (encryptionKey) {
    // Hide the encryption key input after setting the key
    // document.getElementById("encryption-key-container").style.display = "none";
    loadSecretsFromLocalStorage(); // Load secrets after setting the key
  } else {
    alert("Please enter a valid password.");
  }
}

// Function to encrypt text using AES
function encryptText(text) {
  return CryptoJS.AES.encrypt(text, encryptionKey).toString();
}

// Function to decrypt text using AES
function decryptText(encryptedText) {
  const bytes = CryptoJS.AES.decrypt(encryptedText, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// Save secret to localStorage with encryption
function saveSecretToLocalStorage(name, description, value) {
  const encryptedValue = encryptText(value);
  const secrets = JSON.parse(localStorage.getItem("secrets")) || [];
  secrets.push({ name, description, value: encryptedValue });
  localStorage.setItem("secrets", JSON.stringify(secrets));
}

function deleteSecretFromLocalStorage(index) {
  const secrets = JSON.parse(localStorage.getItem("secrets")) || [];
  secrets.splice(index, 1); // Remove the secret at the specified index
  localStorage.setItem("secrets", JSON.stringify(secrets));
  loadSecretsFromLocalStorage(); // Refresh the displayed list
}

// Load secrets from localStorage and decrypt values
function loadSecretsFromLocalStorage() {
  const secrets = JSON.parse(localStorage.getItem("secrets")) || [];
  const secretsTableBody = document
    .getElementById("secrets-table")
    .getElementsByTagName("tbody")[0];
  secretsTableBody.innerHTML = ""; // Clear the table

  secrets.forEach((secret, index) => {
    const decryptedValue = decryptText(secret.value);

    const row = secretsTableBody.insertRow();
    row.innerHTML = `
            <td>${secret.name}</td>
            <td>${secret.description}</td>
            <td>
                <span class="hidden-value">••••••••••</span>
                <span class="actual-value" style="display:none;">${decryptedValue}</span>
            </td>
            <td>
                <button class="toggle-visibility-button">👁</button>
            </td>
            <td>
                <button class="delete-button" data-index="${index}">Delete</button>
            </td>
        `;

    // Add event listener to the toggle visibility button
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

    // Add event listener to the delete button
    row.querySelector(".delete-button").addEventListener("click", function () {
      deleteSecretFromLocalStorage(index); // Use index from forEach
    });
  });

  // secrets.forEach((secret) => {
  // 	const decryptedValue = decryptText(secret.value);

  // 	const row = secretsTableBody.insertRow();
  // 	// row.innerHTML = `
  // 	//     <td>${secret.name}</td>
  // 	//     <td>${secret.description}</td>
  // 	//     <td>
  // 	//         <span class="hidden-value">••••••••••</span>
  // 	//         <span class="actual-value" style="display:none;">${decryptedValue}</span>
  // 	//     </td>
  // 	//     <td>
  // 	//         <button class="toggle-visibility-button">👁</button>
  // 	//     </td>
  // 	// `;

  // 	row.innerHTML = `
  //         <td>${secret.name}</td>
  //         <td>${secret.description}</td>
  //         <td>
  //             <span class="hidden-value">••••••••••</span>
  //             <span class="actual-value" style="display:none;">${decryptedValue}</span>
  //         </td>
  //         <td>
  //             <button class="toggle-visibility-button">👁</button>
  //         </td>
  //         <td>
  //             <button class="delete-button" data-index="${index}">Delete</button>
  //         </td>
  //     `;

  // 	// Add event listener to the delete button
  // 	row.querySelector(".delete-button").addEventListener("click", function () {
  // 		deleteSecretFromLocalStorage(index);
  // 	});

  // 	// Add event listener to toggle the visibility of the value
  // 	row
  // 		.querySelector(".toggle-visibility-button")
  // 		.addEventListener("click", function () {
  // 			const actualValue = row.querySelector(".actual-value");
  // 			const hiddenValue = row.querySelector(".hidden-value");

  // 			if (actualValue.style.display === "none") {
  // 				actualValue.style.display = "inline";
  // 				hiddenValue.style.display = "none";
  // 			} else {
  // 				actualValue.style.display = "none";
  // 				hiddenValue.style.display = "inline";
  // 			}
  // 		});
  // });
}

// Add new secret from the form
document
  .getElementById("add-secret-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("secret-name").value;
    const description = document.getElementById("secret-description").value;
    const value = document.getElementById("secret-value").value;

    saveSecretToLocalStorage(name, description, value);

    // Reset the form
    document.getElementById("add-secret-form").reset();

    // Reload the secrets list
    loadSecretsFromLocalStorage();
  });

// Load secrets when the page is loaded
window.onload = function () {
  loadSecretsFromLocalStorage();
};

document
  .getElementById("set-key-button")
  .addEventListener("click", setEncryptionKey);
