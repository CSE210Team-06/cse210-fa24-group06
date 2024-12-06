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
