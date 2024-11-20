const urlParams = new URLSearchParams(window.location.search);
const journalId = urlParams.get("journalId");

console.log("Journal ID inside journal.js:", journalId);

const easyMDE = new EasyMDE({
	element: document.getElementById("journal-text-area"),
});

async function fetchJournal(journalId) {
	try {
		const response = await fetch("http://localhost:5000/journals");
		const data = await response.json();
		console.log(data);

		console.log("Journal ID:", journalId);

		// return data;
		if (journalId) {
			console.log("inside if");
			let journal = data.find((journal) => journal.id === journalId);
			return journal;

			// console.log(
			// 	data.journals.find((journal) => journal.id === parseInt(journalId))
			// );
			// return data.journals.find(
			// 	(journal) => journal.id === parseInt(journalId)
			// );
		} else {
			console.log("inside else");
			// console.log(data.journals);
			// return data.journals;
		}
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}

if (journalId) {
	async function loadJournal() {
		const journal = await fetchJournal(journalId);

		console.log("Journal:", journal);

		document.getElementById("journal-title").value =
			`Journal ${journalId}: ${journal.title}`;
		easyMDE.value(`${journal.content}.`);
	}
	loadJournal();
}

const saveJournalBtn = document.getElementById("save-journal-btn");
saveJournalBtn.addEventListener("click", () => {
	const journalTitle = document.getElementById("journal-title").value;
	const journalEntry = easyMDE.value();
	console.log("Journal saved:", journalTitle, journalEntry);
});

document
	.getElementById("back-to-home-btn")
	.addEventListener("click", function () {
		window.location.href = "../index.html"; // Replace with your home page URL
	});
