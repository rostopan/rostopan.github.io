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
let reqCode
if (reqs[reqs.length-1]) {
	reqCode = reqs[reqs.length-1][0];
} else {
	reqCode = 0
};

countreqs();

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
		let movingReqCode = movingReq.id;
		let movingReqCodeArray = reqs.find((array) => array[0] == movingReqCode);
		let movingReqCodeArrayIndex = reqs.indexOf(movingReqCodeArray);
		let swappingReq = movingReq.nextElementSibling;
		if (swappingReq) {
			let swappingReqCode = swappingReq.id;
			let swappingReqCodeArray = reqs.find((array) => array[0] == swappingReqCode);
			let swappingReqCodeArrayIndex = reqs.indexOf(swappingReqCodeArray); /* O_o */
			buttonCell.insertBefore(swappingReq, movingReq);
			if (reqs[movingReqCodeArrayIndex][1] === reqs[swappingReqCodeArrayIndex][1]) {
				let tempArray = reqs[movingReqCodeArrayIndex]
				reqs[movingReqCodeArrayIndex] = reqs[swappingReqCodeArrayIndex]
				reqs[swappingReqCodeArrayIndex] = tempArray
			}
			
			console.log(movingReqCodeArrayIndex)
			console.log(swappingReqCodeArrayIndex)
			console.log(reqs)
		}
	} else if (button.classList.contains('reqUp')) {
		let movingReq = button.closest('div');
		let movingReqCode = movingReq.id;
		let movingReqCodeArray = reqs.find((array) => array[0] == movingReqCode);
		let movingReqCodeArrayIndex = reqs.indexOf(movingReqCodeArray);
		let swappingReq = movingReq.previousElementSibling;
		if (swappingReq) {
			let swappingReqCode = swappingReq.id;
			let swappingReqCodeArray = reqs.find((array) => array[0] == swappingReqCode);
			let swappingReqCodeArrayIndex = reqs.indexOf(swappingReqCodeArray);
			if (reqs[movingReqCodeArrayIndex][1] === reqs[swappingReqCodeArrayIndex][1]) {
				buttonCell.insertBefore(movingReq, swappingReq);
				let tempArray = reqs[swappingReqCodeArrayIndex]
				reqs[swappingReqCodeArrayIndex] = reqs[movingReqCodeArrayIndex]
				reqs[movingReqCodeArrayIndex] = tempArray
			}
			console.log(movingReqCodeArrayIndex)
			console.log(swappingReqCodeArrayIndex)
			console.log(reqs)
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
