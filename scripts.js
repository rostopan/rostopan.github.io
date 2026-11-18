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
let reqs = JSON.parse(localStorage.getItem("reqs"));
let reqCode
if (reqs.length !== 0) {
	reqCode = reqs[reqs.length-1][0]+1;
	reqs.forEach((req) => {
		add(req[0], req[1], req[2], req[3], req[4], req[5])
	});
} else {
	reqCode = 0
};
countreqs();

function add(reqId, reqDate, reqStatus, reqSubject, reqType, reqNotes) {
	const reqDateLocal = new Date(reqDate).toLocaleDateString('en-US')
	const reqDivCode =`
	<div class="${reqSubject}" id="${reqId}">
		<b><u>${reqSubject} ${reqType}</u></b>
		<select class="selection"><option>Not started</option><option>In progress</option><option>Done</option></select>
		<button type="button" class="delete" onclick="this.closest('div').remove()">Delete</button><button type="button" class="reqUp">↑</button><button type="button" class="reqDown">↓</button>
		<div>${reqNotes}</div>
	</div>
	`
	let dateId = document.getElementById(reqDate);
	if (reqDate === '') {
		return
	} else if (dateId === null) {
		const reqRowCode =`
		<tr>
			<th>
				<p>${reqDateLocal}</p>
				<textarea size="10" placeholder="Add extra notes here..."></textarea><br><button type="button" class="delete" onclick="this.closest('tr').remove()">Delete</button><button type="button" class="rowUp">↑</button><button type="button" class="rowDown">↓</button>
			</th>
			<td id="${reqDate}">
				${reqDivCode}
			</td>
		</tr>
		`;
		table.insertAdjacentHTML("beforeend", reqRowCode);
	} else {
		dateId.insertAdjacentHTML("beforeend", reqDivCode);
	}
	const reqDivHTML = document.getElementById(reqId);
	const reqSelector = reqDivHTML.querySelector('select');
	reqSelector.value = reqStatus;
	console.log(reqDivHTML)
	console.log(reqSelector)
	console.log(reqSelector.value)
	countreqs();
}

submit.addEventListener("click", (event) => {
	const dateValue = date.value;
	const dateValueLocal = new Date(dateValue).toLocaleDateString('en-US')
	const subjectValue = subject.value;
	const typeValue = type.value;
	const notesValue = notes.value;
	const divCode =`
	<div class="${subjectValue}" id="${reqCode}">
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
		const reqArray = new Array(reqCode, dateValue, "Not started", subjectValue, typeValue, notesValue);
		reqs.push(reqArray);
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
		console.log(reqs);
		reqCode+=1
	} else {
		const reqArray = new Array(reqCode, dateValue, "Not started", subjectValue, typeValue, notesValue);
		reqs.push(reqArray);
		dateId.insertAdjacentHTML("beforeend", divCode);
		console.log(reqs);
		reqCode+=1
	}
	localStorage.setItem("reqs", JSON.stringify(reqs))
	countreqs();
});

table.addEventListener("click", (event) => {
	const button = event.target;
	const buttonCell = button.closest('td');
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
		const deleter = event.target;
		if (deleter.className === "delete") {
			const deleterReq = deleter.closest('div');
			const deleterReqCode = deleterReq.id;
			const reqArray = reqs.find((array) => array[0] == deleterReqCode);
			const reqArrayIndex = reqs.indexOf(reqArray);
			console.log(reqs)
			reqs.splice(reqArrayIndex, 1)
			console.log(reqs)
		}
		localStorage.setItem("reqs", JSON.stringify(reqs))
		countreqs();
	}
});

table.addEventListener("change", (event) => {
	const selector = event.target;
	if (selector.className === "selection") {
		const selectorValue = selector.value;
		const selectorReq = selector.closest('div');
		const selectorReqCode = selectorReq.id;
		const reqArray = reqs.find((array) => array[0] == selectorReqCode);
		reqArray[2] = selector.value;
	}
	localStorage.setItem("reqs", JSON.stringify(reqs))
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

/* 
to-do:
	in the array, add requirements to the end of their respective date sections and not at the end of the array
	somehow figure how to store and import the array data
	
	allow text wrapping when the table gets too wide
	save the information onto the client
*/
