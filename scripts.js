const statusElements = document.getElementsByClassName("selection");
const submit = document.getElementById("submit");
const date = document.getElementById("date");
const subject = document.getElementById("subject");
const type = document.getElementById("type");
const notes = document.getElementById("notes");
const table = document.getElementById("table");
const tableHeader = document.getElementById("tableHeader");
const tableHeaderTbody = tableHeader.closest('tbody')
let statusArray = Array.from(statusElements);
let reqs = [];
countreqs();

submit.addEventListener("click", (event) => {
	const dateValue = date.value;
	const dateValueLocal = new Date(dateValue).toLocaleDateString('en-US')
	const subjectValue = subject.value;
	const typeValue = type.value;
	const notesValue = notes.value;
	const divCode =`
	<div class="${subjectValue}">
		<b><u>${subjectValue} ${typeValue}</u></b>
		<select class="selection"><option>Not started</option><option>In progress</option><option>Done</option></select>
		<button type="button" class="delete" onclick="this.closest('div').remove()">Delete</button><button type="button" class="reqUp">↑</button><button type="button" class="reqDown">↓</button>
		<div>${notesValue}</div>
	</div>
	`
	
	let dateId = document.getElementById(dateValue);
	if (date.value === '') {
		return
	} else if (dateId === null) {
		const rowCode =`
		<tr>
			<th>
				<p>${dateValueLocal}</p>
				<textarea size="10" placeholder="Add extra notes here..."></textarea><br><button type="button" class="delete" onclick="this.closest('tr').remove()">Delete</button><button type="button" class="rowUp">↑</button><button type="button" class="rowDown">↓</button>
			</th>
			<td id="${dateValue}">
				${divCode}
			</td>
		</tr>
		`;
		table.insertAdjacentHTML("beforeend", rowCode);
	} else {
		dateId.insertAdjacentHTML("beforeend", divCode);
	}
	countreqs();
});

table.addEventListener("click", (event) => {
	const button = event.target
	const buttonCell = button.closest('td')
	if (button.classList.contains('rowUp')) {
		let movingTbody = button.closest('tbody');
		let swappingTbody = movingTbody.previousElementSibling;
		if (swappingTbody !== tableHeaderTbody) {
			table.insertBefore(movingTbody, swappingTbody);
		}
	} else if (button.classList.contains('rowDown')) {
		let movingTbody = button.closest('tbody');
		let swappingTbody = movingTbody.nextElementSibling;
		if (swappingTbody) {
			table.insertBefore(swappingTbody, movingTbody);
		}
	} else if (button.classList.contains('reqDown')) {
		let movingReq = button.closest('div');
		let swappingReq = movingReq.nextElementSibling;
		if (swappingReq) {
			buttonCell.insertBefore(swappingReq, movingReq);
		}
	} else if (button.classList.contains('reqUp')) {
		let movingReq = button.closest('div');
		let swappingReq = movingReq.previousElementSibling;
		if (swappingReq) {
			buttonCell.insertBefore(movingReq, swappingReq);
		}
	} else {
		countreqs()
	}
});

table.addEventListener("change", (event) => {
	countreqs()
});

function countreqs() {
	statusArray = Array.from(statusElements);
	const statuses = document.querySelectorAll(".selection");
	let notStarted = 0;
	let inProgress = 0;
	let done = 0;
	statusArray.forEach(status => {
		if (status.value === "Not started") {
			notStarted+=1
		} else if (status.value === "In progress") {
			inProgress+=1
		} else {
			done+=1
		}
	});
	document.getElementById("notStarted").innerHTML = notStarted;
	document.getElementById("inProgress").innerHTML = inProgress;
	document.getElementById("done").innerHTML = done;
}
