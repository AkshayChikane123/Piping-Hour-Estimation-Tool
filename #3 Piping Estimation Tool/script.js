// Function to add a new row to the table
function addRow() {
	const tableBody = document.getElementById("inputRows");
	const rowCount = tableBody.childElementCount + 1; // Determine the next row number
	const newRow = document.createElement("tr");

	newRow.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" name="siteName" placeholder="Site Name"></td>
        <td><input type="number" name="lineCounts[]" required min="1" onchange="defaultValues(this); updateSubtotalInput()"></td>
        <td><input type="number" name="totalExpectedPID" min="0" onchange="updateSubtotalInput()"></td>
        <td><input type="number" name="sumBendsTeesReducers" min="0" onchange="updateSubtotalInput()"></td>
        <td><input type="number" name="totalEquipments" min="0" onchange="updateSubtotalInput()"></td>
        <td><input type="number" name="totalValves" min="0" onchange="updateSubtotalInput()"></td>
        <td><input type="number" name="totalLineSegments" min="0" onchange="updateSubtotalInput()"></td>
        <td><input type="number" name="pipeSupport" min="0" onchange="updateSubtotalInput()"></td>
        <td><input type="number" name="countInstrumentation" min="0" onchange="updateSubtotalInput()"></td>
         <td><input type="number" name="deckNumber" min="0" onchange="updateSubtotalInput(); calculateArea(this)"></td>
        <td><input type="number" name="avgArea" min="0" onchange="updateSubtotalInput(); calculateArea(this)"></td>
<td>
    <select name="complexFactor" onchange="updateSubtotalInput(); calculateArea(this)">
        <option value="1">1</option>
        <option value="0.9">0.9</option>
        <option value="0.8">0.8</option>
        <option value="0.7">0.7</option>
        <option value="0.6">0.6</option>
        <option value="0.5">0.5</option>
        <option value="0.4">0.4</option>
        <option value="0.3">0.3</option>
        <option value="0.2">0.2</option>
        <option value="0.1">0.1</option>
    </select></td>
        <td><input type="number" class="totalArea" name="totalArea" onchange="updateSubtotalInput()" readonly></td>           
        <td>
            <button type="button" onclick="deleteRow(this)" class="btn-danger" >Delete</button>
        </td>
    `;

	tableBody.appendChild(newRow); // Add the new row to the table
	defaultValues(newRow.querySelector('input[name="lineCounts[]"]')); // Initialize default values for the first input
	updateSubtotalInput(); // Update subtotal immediately after adding the row
}

function calculateArea(element) {
	// Find the row of the element
	const row = element.closest("tr");

	// Retrieve values from the row's inputs
	const deckNumber =
		parseFloat(row.querySelector('input[name="deckNumber"]').value) || 0;
	const avgArea =
		parseFloat(row.querySelector('input[name="avgArea"]').value) || 0;

	// Retrieve the complexFactor value from the select element
	const complexFactorElement = row.querySelector(
		'select[name="complexFactor"]'
	);
	const complexFactor = complexFactorElement
		? parseFloat(complexFactorElement.value) || 1
		: 1;

	// console.log('Deck Number:', deckNumber);
	// console.log('Average Area:', avgArea);
	// console.log('Complex Factor:', complexFactor);
	// Perform the calculation
	const totalArea = deckNumber * avgArea * complexFactor;
	// console.log('Total Area:', totalArea);

	// Update the totalArea input field
	row.querySelector('input[name="totalArea"]').value = totalArea.toFixed(2); // Optional: format to 2 decimal places
}

// Function to delete a row
function deleteRow(button) {
	const row = button.parentNode.parentNode;
	const tableBody = document.getElementById("inputRows");
	tableBody.removeChild(row);

	// Recalculate row numbers to maintain order
	Array.from(tableBody.children).forEach((row, index) => {
		row.children[0].textContent = index + 1; // Update the row numbers
	});
}
// Add a default row when the page loads
document.addEventListener("DOMContentLoaded", () => {
	addRow(); // Add a blank row on page load
});

// Function to calculate and set default values based on "Total Line Counts"
function defaultValues(input) {
	const row = input.parentNode.parentNode; // Get the parent row
	// console.log("row", row);
	const lineCounts = parseInt(input.value, 10); // Get the value of "Total Line Counts"

	if (isNaN(lineCounts) || lineCounts < 1) {
		return; // If not a valid number or less than 1, do nothing
	}

	// Calculate derived values based on the given logic
	const totalExpectedPID = Math.ceil(lineCounts / 4);
	const sumBendsTeesReducers = lineCounts * 5;
	const totalEquipments = Math.ceil(lineCounts * 0.4);
	const totalValves = lineCounts * 3;
	const totalLineSegments = lineCounts + lineCounts * 5 + lineCounts * 3;
	const pipeSupport = lineCounts * 5;
	const countInstrumentation = lineCounts * 8;

	// Update the corresponding fields in the same row
	row.querySelector('input[name="totalExpectedPID"]').value = totalExpectedPID;
	row.querySelector('input[name="sumBendsTeesReducers"]').value =
		sumBendsTeesReducers;
	row.querySelector('input[name="totalEquipments"]').value = totalEquipments;
	row.querySelector('input[name="totalValves"]').value = totalValves;
	row.querySelector('input[name="totalLineSegments"]').value =
		totalLineSegments;
	row.querySelector('input[name="pipeSupport"]').value = pipeSupport;
	row.querySelector('input[name="countInstrumentation"]').value =
		countInstrumentation;
}
// Function to update the subtotal row
function updateSubtotalInput() {
	const tableBody = document.getElementById("inputRows");
	const rows = tableBody.querySelectorAll("tr");

	let subtotalLineCounts = 0;
	let subtotalExpectedPID = 0;
	let subtotalBendsTeesReducers = 0;
	let subtotalEquipments = 0;
	let subtotalValves = 0;
	let subtotalLineSegments = 0;
	let subtotalPipeSupport = 0;
	let subtotalcountInstrumentation = 0;
	let subtotaldeckNumber = 0;
	let subtotalavgArea = 0;
	// let subtotalcomplexFactor = 0;
	let subtotaltotalArea = 0;

	rows.forEach((row) => {
		subtotalLineCounts +=
			parseInt(row.querySelector('input[name="lineCounts[]"]').value, 10) || 0;
		subtotalExpectedPID +=
			parseInt(row.querySelector('input[name="totalExpectedPID"]').value, 10) ||
			0;
		subtotalBendsTeesReducers +=
			parseInt(
				row.querySelector('input[name="sumBendsTeesReducers"]').value,
				10
			) || 0;
		subtotalEquipments +=
			parseInt(row.querySelector('input[name="totalEquipments"]').value, 10) ||
			0;
		subtotalValves +=
			parseInt(row.querySelector('input[name="totalValves"]').value, 10) || 0;
		subtotalLineSegments +=
			parseInt(
				row.querySelector('input[name="totalLineSegments"]').value,
				10
			) || 0;
		subtotalPipeSupport +=
			parseInt(row.querySelector('input[name="pipeSupport"]').value, 10) || 0;
		subtotalcountInstrumentation +=
			parseInt(
				row.querySelector('input[name="countInstrumentation"]').value,
				10
			) || 0;
		subtotaldeckNumber +=
			parseInt(row.querySelector('input[name="deckNumber"]').value, 10) || 0;
		subtotalavgArea +=
			parseInt(row.querySelector('input[name="avgArea"]').value, 10) || 0;
		// subtotalcomplexFactor += parseInt(row.querySelector('input[name="complexFactor"]').value, 10) || 0;
		subtotaltotalArea +=
			parseInt(row.querySelector('input[name="totalArea"]').value, 10) || 0;
	});

	document.getElementById("subtotalLineCounts").textContent =
		subtotalLineCounts;
	document.getElementById("subtotalExpectedPID").textContent =
		subtotalExpectedPID;
	document.getElementById("subtotalBendsTeesReducers").textContent =
		subtotalBendsTeesReducers;
	document.getElementById("subtotalEquipments").textContent =
		subtotalEquipments;
	document.getElementById("subtotalValves").textContent = subtotalValves;
	document.getElementById("subtotalLineSegments").textContent =
		subtotalLineSegments;
	document.getElementById("subtotalPipeSupport").textContent =
		subtotalPipeSupport;
	document.getElementById("subtotalcountInstrumentation").textContent =
		subtotalcountInstrumentation;
	document.getElementById("subtotaldeckNumber").textContent =
		subtotaldeckNumber;
	document.getElementById("subtotalavgArea").textContent = subtotalavgArea;
	// document.getElementById("subtotalcomplexFactor").textContent = subtotalcomplexFactor;
	document.getElementById("subtotaltotalArea").textContent = subtotaltotalArea;
}

document.addEventListener("DOMContentLoaded", function () {
	// const structuralModelling = document.getElementById("structuralModelling");
	const specSheetDropdown = document.getElementById("specSheetDropdown");
	const pipeSupportDropdown = document.getElementById("pipeSupportDropdown");
	const lodDropdown = document.getElementById("lodDropdown");
	const inputContainer = document.getElementById("inputContainer");
	const inputContainer1 = document.getElementById("inputContainer1");

	let pmsInputValue = 0; // Initialize variable to store PMS input value
	let isPipeSupportOutOfScope = false; // Initialize variable to store Pipe Support state
	let selectedLOD = "LOD 300"; // Initialize variable to store selected LOD

	// let totalNoOfDecks = 0;
	// let averageAreaofDeck = 0;
	// let totalArea = 0;
	// let complexFactor = 1;
	// let structuralModellingTime = 0;

	function updateInputContainer() {
		inputContainer.innerHTML = ""; // Clear existing content
		// inputContainer1.innerHTML = ""; // Clear existing content

		// if (structuralModelling.value === "Yes") {
		// 	// Add Structural Modelling inputs
		// 	const label1 = document.createElement("label");
		// 	label1.textContent = "Total No of Decks";
		// 	const input1 = document.createElement("input");
		// 	input1.type = "number";
		// 	input1.min = 0; // Ensure the number is non-negative
		// 	input1.placeholder = "Total Number of Decks";

		// 	const label2 = document.createElement("label");
		// 	label2.textContent = "Avg Area per Deck (Sq.meter)";
		// 	const input2 = document.createElement("input");
		// 	input2.type = "number";
		// 	input2.min = 0; // Ensure the number is non-negative
		// 	input2.placeholder = "Avg Area in sq meters";

		// 	const label3 = document.createElement("label");
		// 	label3.textContent = "Complex Factor";
		//     const input3 = document.createElement("select");
		//     // input3.id = "complexfactor";
		// 	const factors = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
		// 	factors.forEach((factor) => {
		// 		const option = document.createElement("option");
		// 		option.value = factor;
		// 		option.textContent = factor;
		// 		input3.appendChild(option);
		// 	});

		// 	// Create and add submit button
		// 	const submitButton = document.createElement("button");
		// 	submitButton.textContent = "Submit";
		// 	submitButton.type = "button";
		// 	submitButton.addEventListener("click", function () {
		// 		totalNoOfDecks = parseFloat(input1.value) || 0;
		// 		averageAreaofDeck = parseFloat(input2.value) || 0;
		// 		complexFactor = parseFloat(input3.value) || 1;

		// 		calculateTotalArea();
		// 		// calculateStructuralModellingTime();
		// 		displayResults();
		// 	});

		// 	// Add fields to the container
		// 	inputContainer.appendChild(label1);
		// 	inputContainer.appendChild(input1);
		// 	inputContainer.appendChild(label2);
		// 	inputContainer.appendChild(input2);
		// 	inputContainer.appendChild(label3);
		// 	inputContainer.appendChild(input3);
		// 	inputContainer.appendChild(submitButton);

		// 	// Create placeholders for Total Area and Structural Modelling Time
		// 	const totalAreaLabel = document.createElement("label");
		// 	totalAreaLabel.textContent = "Total Area";
		// 	totalAreaLabel.style.display = "none"; // Hide initially
		// 	const totalAreaDisplay = document.createElement("input");
		// 	totalAreaDisplay.type = "text";
		// 	totalAreaDisplay.disabled = true;
		// 	totalAreaDisplay.id = "totalAreaDisplay"; // Set ID for easy access
		// 	totalAreaDisplay.style.display = "none"; // Hide initially

		// 	// Add placeholders to the container
		// 	inputContainer.appendChild(totalAreaLabel);
		// 	inputContainer.appendChild(totalAreaDisplay);

		// }

		if (specSheetDropdown.value === "Yes") {
			// Add Specification Sheet inputs
			const label = document.createElement("label");
			label.textContent = "Enter No of PMS";
			const input = document.createElement("input");
			input.type = "number";
			input.min = 0; // Ensure the number is non-negative

			input.placeholder = "Number of PMS";
			input.addEventListener("input", function () {
				pmsInputValue = parseInt(input.value, 10) || 0;
			});

			inputContainer.appendChild(label);
			inputContainer.appendChild(input);
		}
	}

	// function calculateTotalArea() {
	// 	totalArea = totalNoOfDecks * averageAreaofDeck*complexFactor;
	// }

	// function displayResults() {
	// 	const totalAreaLabel =
	// 		document.querySelector("#totalAreaDisplay").previousElementSibling;
	// 	const totalAreaDisplay = document.getElementById("totalAreaDisplay");

	// 	if (totalAreaDisplay) {
	// 		totalAreaDisplay.value = `${totalArea}`;
	// 		totalAreaLabel.style.display = "block"; // Show the label
	// 		totalAreaDisplay.style.display = "block"; // Show the result
	// 	}

	// }

	// structuralModelling.addEventListener("change", updateInputContainer);
	specSheetDropdown.addEventListener("change", updateInputContainer);
	pipeSupportDropdown.addEventListener("change", function () {
		isPipeSupportOutOfScope = pipeSupportDropdown.value === "Out of Scope";
	});
	lodDropdown.addEventListener("change", function () {
		selectedLOD = lodDropdown.value;
	});

	// Store the PMS input value in a global variable for access in other functions
	window.getPmsInputValue = function () {
		return pmsInputValue;
	};

	// Store the Pipe Support state in a global variable for access in other functions
	window.getPipeSupportState = function () {
		return isPipeSupportOutOfScope;
	};

	// Store the selected LOD in a global variable for access in other functions
	window.getSelectedLOD = function () {
		return selectedLOD;
	};
});

// Define defaultTimes globally or in a scope accessible by both setDefaultTime() and openSettingsModal()
let defaultTimes = {
	"Volume Creation": 5,
	"Centreline Creation": 5,
	"Line List Creation": 15,
	"3D Markups": 40,
	"Piping 3D Modelling": 160,
	"Pipe Supports": 8,
	"PMS (Spec Sheet) generation": 480,
	"Equipment Modelling Project": 180,
	"Admin Setup": 30,
	"Plot Plan Creation": 40,
	"Equipment Layout Creation": 65,
	"P&ID Creation": 240,
	"PFD Creation": 180,
	"Inspection Isometrics": 240,
	"Bulk MTO Creation": 5,
	"Equipment Tagging": 10,
	"P&ID Updation": 10,
	"Instrumentation": 15,
    "Structural Modelling": 8,
    "HVAC Modelling": 5, 
};

// // Function to save settings for default and update defaultTimes object
function saveSettings() {
	const inputs = document.querySelectorAll("#settingsTable tbody input");
	// event.stopPropagation();
	inputs.forEach((input) => {
		const description = input.dataset.description;
		const newValue = parseInt(input.value, 10);
		if (!isNaN(newValue)) {
			defaultTimes[description] = newValue;
		}
	});

	console.log("Updated defaultTimes:", defaultTimes);

	// Optionally, provide feedback or notifications
	alert("Settings saved successfully!");
}
// Function to open settings modal and populate the table
function openSettingsModal() {
	const settingsTableBody = document.querySelector("#settingsTable tbody");
	settingsTableBody.innerHTML = "";

	let srNo = 1;
	for (const [description, time] of Object.entries(defaultTimes)) {
		const row = document.createElement("tr");

		const srNoCell = document.createElement("td");
		srNoCell.textContent = srNo++;

		const descriptionCell = document.createElement("td");
		descriptionCell.textContent = description;

		const setTimeCell = document.createElement("td");
		const input = document.createElement("input");
		input.type = "number";
		input.value = time;
		input.className = "form-control";
		input.dataset.description = description;
		setTimeCell.appendChild(input);

		row.appendChild(srNoCell);
		row.appendChild(descriptionCell);
		row.appendChild(setTimeCell);

		settingsTableBody.appendChild(row);
	}

	// Show the modal
	const settingsModal = new bootstrap.Modal(
		document.getElementById("settingsModal")
	);
	settingsModal.show();
}

// Function to save the entire project's data with validation
function saveRow() {
	const tableBody = document.getElementById("inputRows");
	const rows = Array.from(tableBody.querySelectorAll("tr")); // Get all rows

	let hasEmptyFields = false; // Flag to check if any fields are empty
	const projectData = {}; // Object to hold data keyed by site names

	// Loop through each row to collect data
	rows.forEach((row, index) => {
		const rowData = { "Sr No": index + 1 }; // Initialize with row number
		// let rowHasEmptyField = MODIFIED HERE; // Track if this specific row has any empty fields

		// Collect key-value pairs from each input field
		row.querySelectorAll("input").forEach((input) => {
			const key = input.name;
			const value = input.value.trim(); // Trim to remove extra spaces

			// Check if the field is empty
			if (!value) {
				hasEmptyFields = true; // If any field is empty, set the flag
				input.classList.add("invalid-input"); // Add a red border to empty fields
			} else {
				input.classList.remove("invalid-input"); // Remove the red border if filled
			}

			rowData[key] = value; // Add key-value pairs to rowData
		});

		if (!hasEmptyFields) {
			const siteName = rowData["siteName"];
			projectData[siteName] = rowData; // Store rowData under the key of siteName
		}
	});

	if (hasEmptyFields) {
		alert("Please ensure all fields are filled in before saving.");
		return;
	}

	const siteNames = Object.keys(projectData);
	alert(
		"Project data for the following sites has been saved:\n" +
			siteNames.join(", ")
	);

	// Log the detailed data to the console
	console.log("Saved Primary Data:", projectData);

	// Trigger the function to calculate additional data
	selectionFactors();
}

let hasCalculatedTotalHours = false;

function selectionFactors() {
	const calculatedSiteData = {}; // Store calculated data for each site
	// const areaDisplayElement = document.getElementById("totalAreaDisplay");
	// const complexFactor = document.getElementById("complexfactor");
	// Check if the element exists and get its value, default to 0 if not present or empty
	// const areaDisplayValue = areaDisplayElement
	// 	? areaDisplayElement.value || 0
	// 	: 0;

	const tableBody = document.getElementById("inputRows");
	const rows = Array.from(tableBody.querySelectorAll("tr"));

	// Get the PMS input value
	const pmsInputValue = window.getPmsInputValue();

	// Get the Pipe Support state
	const isPipeSupportOutOfScope = window.getPipeSupportState();

	// Get the selected LOD
	const selectedLOD = window.getSelectedLOD();

	// Calculate the component data for each site
	rows.forEach((row) => {
		const siteName = row.querySelector('input[name="siteName"]').value.trim();

		if (!siteName) {
			console.warn("Skipping a row with no site name");
			return; // Skip rows with missing site names
		}

		const lineCounts = parseInt(
			row.querySelector('input[name="lineCounts[]"]').value,
			10
		);

		const totalExpectedPID = parseInt(
			row.querySelector('input[name="totalExpectedPID"]').value,
			10
		);

		const bendsTeesReducer = parseInt(
			row.querySelector('input[name="sumBendsTeesReducers"]').value,
			10
		);
		const totalEquipments = parseInt(
			row.querySelector('input[name="totalEquipments"]').value,
			10
		);

		const totalValves = parseInt(
			row.querySelector('input[name="totalValves"]').value,
			10
		);
		const lineSegments = parseInt(
			row.querySelector('input[name="totalLineSegments"]').value,
			10
		);
		const pipeSupport = parseInt(
			row.querySelector('input[name="pipeSupport"]').value,
			10
		);
		const countInstrumentation = parseInt(
			row.querySelector('input[name="countInstrumentation"]').value,
			10
		);
		const structuralModel = parseInt(
			row.querySelector('input[name="totalArea"]').value,
			10
        );
        
        const hvacModelling = structuralModel * 0.25;
        console.log('hvacModelling', hvacModelling);
		const pipingIsometrics = Math.floor(lineCounts / 3); // or use Math.round(lineCounts / 3) or Math.ceil(lineCounts / 3)

		const calculatedData = {
			"Volume Creation": bendsTeesReducer + totalValves + lineSegments,
			"Centreline Creation": lineSegments,
			"Line List Creation": lineCounts,
			"3D Markups": totalExpectedPID,
			"Piping 3D Modelling": lineCounts,
			"Pipe Supports": isPipeSupportOutOfScope ? 0 : pipeSupport, // Use 0 if out of scope
			"PMS (Spec Sheet) generation": pmsInputValue, // Use the PMS input value here
			"Equipment Modelling Project": totalEquipments,
			"Admin Setup": 60,
			"Plot Plan Creation": lineCounts,
			"Equipment Layout Creation": totalEquipments,
			"P&ID Creation": totalExpectedPID,
			"PFD Creation": totalExpectedPID,
			"Inspection Isometrics": pipingIsometrics, //NEED TO VERIFY
			"Bulk MTO Creation":
				bendsTeesReducer + totalEquipments + totalValves + lineSegments,
			"Equipment Tagging": totalEquipments,
			"P&ID Updation": totalEquipments,
			"Instrumentation": countInstrumentation,
            "Structural Modelling": structuralModel,
            "HVAC Modelling": hvacModelling,
		};

		const estimatedTimes = {};
		for (const [component, value] of Object.entries(calculatedData)) {
			let defaultTime = defaultTimes[component];
			if (defaultTime) {
				// Apply LOD multiplier only to the time calculation of "Equipment Modelling Project"
				if (component === "Equipment Modelling Project") {
					switch (selectedLOD) {
						case "LOD 200":
							defaultTime *= 0.8;
							break;
						case "LOD 100":
							defaultTime *= 0.5;
							break;
						case "LOD 300":
						default:
							defaultTime *= 1;
							break;
					}
				}
				estimatedTimes[component] = defaultTime;
			}
		}
		console.log(
			"calculatedData AND estimatedTimes before sending",
			calculatedData,
			estimatedTimes
		);

		calculatedSiteData[siteName] = {
			calculatedData,
			estimatedTimes,
		};
	});

	// Generate the component table
	const componentTable = generateComponentTable(calculatedSiteData);

	// Get the table container element
	const tableContainer = document.getElementById("tableContainer");

	// Clear existing content
	if (tableContainer) {
		tableContainer.innerHTML = "";
		// Append the component table to the table container
		tableContainer.appendChild(componentTable);

		// Create and append buttons
		const buttonContainer = document.createElement("div");
		buttonContainer.innerHTML = `
            <button type="button" class="btn btn-calculate" onclick="calculateTotalHours(); scrollToFinalContainer()">Calculate Total Hours</button>
            <button class="btn btn-estimate" type="button" onclick="generateEstimate()">Generate Estimation</button>
            <button type="button" class="btn btn-select" onclick="showSelectedCells()">Update Selection</button>

        `;
		tableContainer.appendChild(buttonContainer);
	}
}

function generateComponentTable(calculatedSiteData) {
	const defaultTimes = {}; // Define default times if needed

	const table = document.createElement("table");
	table.classList.add("styled-table");

	const mainHeaderRow = document.createElement("tr");
	const subHeaderRow = document.createElement("tr");

	const mainHeaders = ["#", "Description", "Section"];
	mainHeaders.forEach((header) => {
		const th = document.createElement("th");
		th.rowSpan = 2;
		th.textContent = header;
		mainHeaderRow.appendChild(th);
	});

	const subtotalCells = {};
	for (const siteName in calculatedSiteData) {
		const th = document.createElement("th");
		th.colSpan = 3;
		th.textContent = siteName;
		mainHeaderRow.appendChild(th);

		["Comp Count", "Time (Min)", "Total Time (Hours)"].forEach((subHeader) => {
			const subTh = document.createElement("th");
			subTh.textContent = subHeader;
			subHeaderRow.appendChild(subTh);
		});

		const subtotalCountCell = document.createElement("td");
		const subtotalHoursCell = document.createElement("td");
		subtotalCells[siteName] = {
			count: subtotalCountCell,
			hours: subtotalHoursCell,
		};
	}

	table.appendChild(mainHeaderRow);
	table.appendChild(subHeaderRow);

	const sections = [
		{ section: "Piping", description: "Volume Creation" },
		{ section: "Piping", description: "Centreline Creation" },
		{ section: "Piping", description: "Line List Creation" },
		{ section: "Piping", description: "3D Markups" },
		{ section: "Piping", description: "Piping 3D Modelling" },
		{ section: "Piping", description: "Pipe Supports" },
		{ section: "Piping", description: "PMS (Spec Sheet) generation" },
		{
			section: "Equipment Modelling",
			description: "Equipment Modelling Project",
		},
		{
			section: "Admin Setup",
			description: "Admin Setup",
		},
		{ section: "Deliverables", description: "Plot Plan Creation" },
		{ section: "Deliverables", description: "Equipment Layout Creation" },
		{ section: "Deliverables", description: "P&ID Creation" },
		{ section: "Deliverables", description: "PFD Creation" },
		{ section: "Deliverables", description: "Inspection Isometrics" },
		{ section: "Deliverables", description: "Bulk MTO Creation" },
		{ section: "Deliverables", description: "Equipment Tagging" },
		{ section: "Deliverables", description: "P&ID Updation" },
		{ section: "Deliverables", description: "Instrumentation" },
        { section: "Deliverables", description: "Structural Modelling" },
        { section: "Deliverables", description: "HVAC Modelling" },
	];

	sections.forEach((sectionData, index) => {
		const row = document.createElement("tr");

		const checkboxCell = document.createElement("td");
		const checkboxInput = document.createElement("input");
		checkboxInput.type = "checkbox";
		checkboxInput.classList.add("checkbox-input");
		checkboxInput.dataset.section = sectionData.description;

		if (
			sectionData.section === "Equipment Modelling" ||
			sectionData.section === "Admin Setup"
		) {
			checkboxInput.checked = true;
		}

		checkboxCell.appendChild(checkboxInput);
		row.appendChild(checkboxCell);

		const descriptionCell = document.createElement("td");
		descriptionCell.textContent = sectionData.description;
		row.appendChild(descriptionCell);

		const sectionCell = document.createElement("td");
		sectionCell.textContent = sectionData.section;
		row.appendChild(sectionCell);

		for (const siteName in calculatedSiteData) {
			const calculatedData = calculatedSiteData[siteName].calculatedData;
			const estimatedTimes = calculatedSiteData[siteName].estimatedTimes;

			const count = calculatedData[sectionData.description] || 0;
			const defaultTime = estimatedTimes[sectionData.description] || 0;
			const estimatedHours = ((count * defaultTime) / 60).toFixed(2);

			const countCell = document.createElement("td");
			countCell.textContent = count;
			row.appendChild(countCell);

			const defaultTimeCell = document.createElement("td");
			const defaultTimeInput = document.createElement("input");
			defaultTimeInput.type = "number";
			defaultTimeInput.value = defaultTime;
			defaultTimeInput.min = 0;
			defaultTimeInput.dataset.section = sectionData.description;
			defaultTimeInput.dataset.site = siteName;

			defaultTimeInput.addEventListener("change", (event) => {
				const newDefaultTime = parseFloat(event.target.value);
				if (!isNaN(newDefaultTime) && newDefaultTime >= 0) {
					const newEstimatedHours = ((count * newDefaultTime) / 60).toFixed(2);
					estimatedTimes[sectionData.description] = newDefaultTime;
					const estimatedHoursCell = document.querySelector(
						`td[data-section="${sectionData.description}"][data-site="${siteName}"]`
					);
					if (estimatedHoursCell) {
						estimatedHoursCell.dataset.estimatedHours = newEstimatedHours;
						if (checkboxInput.checked) {
							estimatedHoursCell.textContent = newEstimatedHours;
						} else {
							estimatedHoursCell.textContent = "0.00";
						}
					}
					calculateSubtotal();
				}
			});
			defaultTimeCell.appendChild(defaultTimeInput);
			row.appendChild(defaultTimeCell);

			const estimatedHoursCell = document.createElement("td");
			estimatedHoursCell.dataset.section = sectionData.description;
			estimatedHoursCell.dataset.site = siteName;
			estimatedHoursCell.dataset.estimatedHours = estimatedHours;
			estimatedHoursCell.textContent = checkboxInput.checked
				? estimatedHours
				: "0.00";
			row.appendChild(estimatedHoursCell);

			// Ensure each checkbox has the data-site attribute
			checkboxInput.dataset.site = siteName;

			checkboxInput.addEventListener("change", function (event) {
				const isChecked = event.target.checked;
				const newEstimatedHours = (
					(count * (estimatedTimes[sectionData.description] || 0)) /
					60
				).toFixed(2);
				estimatedHoursCell.dataset.estimatedHours = newEstimatedHours;
				estimatedHoursCell.textContent = isChecked ? newEstimatedHours : "0.00";
				console.log(
					`Estimated hours for ${sectionData.description} at ${siteName}: ${estimatedHoursCell.textContent}`
				);
				calculateSubtotal();
			});
		}

		table.appendChild(row);
	});

	const subtotalRow = document.createElement("tr");
	["", ""].forEach(() => {
		const emptyCell = document.createElement("td");
		subtotalRow.appendChild(emptyCell);
	});
	for (const siteName in subtotalCells) {
		const subtotalLabelCell = document.createElement("td");
		subtotalLabelCell.textContent = "Subtotal";
		subtotalRow.appendChild(subtotalLabelCell);
		subtotalRow.appendChild(subtotalCells[siteName].count);
		const emptyCell = document.createElement("td");
		subtotalRow.appendChild(emptyCell);
		subtotalRow.appendChild(subtotalCells[siteName].hours);
	}
	table.appendChild(subtotalRow);

	function calculateSubtotal() {
		for (const siteName in calculatedSiteData) {
			let totalCounts = 0;
			let totalEstimatedHours = 0;

			for (const sectionData of sections) {
				const count =
					calculatedSiteData[siteName].calculatedData[
						sectionData.description
					] || 0;
				const defaultTime =
					calculatedSiteData[siteName].estimatedTimes[
						sectionData.description
					] || defaultTimes[sectionData.description];
				let isChecked = false; // Initialize isChecked as false by default

				// Check if the section should be initially checked
				if (
					sectionData.section === "Equipment Modelling" ||
					sectionData.section === "Admin Setup"
				) {
					isChecked = true; // Set isChecked to true for these sections
				} else {
					const checkbox = document.querySelector(
						`input[data-section="${sectionData.description}"][data-site="${siteName}"]`
					);
					isChecked = checkbox ? checkbox.checked : false; // Get current checkbox state
				}

				const estimatedHours = isChecked ? (count * defaultTime) / 60 : 0;

				totalCounts += count;
				totalEstimatedHours += estimatedHours;

				// console.log(`Checkbox for ${sectionData.description} at ${siteName} is checked: ${isChecked}`);
			}

			subtotalCells[siteName].count.textContent = totalCounts;
			subtotalCells[siteName].hours.textContent =
				totalEstimatedHours.toFixed(2);
		}
	}

	calculateSubtotal(); // Calculate subtotal initially
	return table;
}

function overallEffortTable() {
	let table = document.querySelector(".styled-table");
	let siteData = {}; // Object to store site data

	// Iterate over each row of the table
	table.querySelectorAll("tr").forEach(function (row, rowIndex) {
		if (rowIndex > 1) {
			// Skip header rows (index 0 and 1)
			let cells = row.querySelectorAll("td");

			// Check if the checkbox in the current row is checked
			let checkbox = cells[0].querySelector('input[type="checkbox"]');
			if (checkbox && checkbox.checked) {
				// Extract fixed data from cells
				let description = cells[1].textContent.trim();
				let section = cells[2].textContent.trim();

				// Initialize siteData object for the current site
				for (let colIndex = 3; colIndex < cells.length; colIndex += 3) {
					// Extract site name from corresponding header cell
					let siteName = table
						.querySelector("th:nth-child(" + (colIndex / 3 + 3) + ")")
						.textContent.trim();

					// Extract count and total hours for the current site
					let count = parseInt(cells[colIndex].textContent.trim());
					let totalHours = parseFloat(cells[colIndex + 2].textContent.trim());

					// Initialize site data structure if it doesn't exist
					if (!siteData[siteName]) {
						siteData[siteName] = {};
					}

					// Add data to siteData object for the current site and description
					if (!siteData[siteName][description]) {
						siteData[siteName][description] = {
							section: section,
							count: 0,
							totalHours: 0,
						};
					}

					siteData[siteName][description].count += count;
					siteData[siteName][description].totalHours += totalHours;
				}
			}
		}
	});
	// Store siteData in localStorage
	localStorage.setItem("siteData", JSON.stringify(siteData));

	// Redirect to demoquote.html

	console.log("Site Data:", siteData);
	return siteData;
}

function calculateTotalHours() {
	const newObject = overallEffortTable();
	console.log(newObject, "newOBJECT");

	let siteSums = {};
	let overallSums = {
		pipingSum: 0,
		equipmentModellingSum: 0,
		adminSetupProposalSum: 0,
		deliverablesSum: 0,
		totalEfforts: 0,
	};

	// Initialize sums for each site
	for (const siteName in newObject) {
		siteSums[siteName] = {
			pipingSum: 0,
			equipmentModellingSum: 0,
			adminSetupProposalSum: 0,
			deliverablesSum: 0,
		};

		// Iterate over each section in the site
		for (const description in newObject[siteName]) {
			const section = newObject[siteName][description].section;
			const totalHours = newObject[siteName][description].totalHours;

			if (section.includes("Piping")) {
				siteSums[siteName].pipingSum += totalHours;
				overallSums.pipingSum += totalHours;
			} else if (section.includes("Equipment Modelling")) {
				siteSums[siteName].equipmentModellingSum += totalHours;
				overallSums.equipmentModellingSum += totalHours;
			} else if (section.includes("Admin Setup")) {
				siteSums[siteName].adminSetupProposalSum += totalHours;
				overallSums.adminSetupProposalSum += totalHours;
			} else if (section.includes("Deliverables")) {
				siteSums[siteName].deliverablesSum += totalHours;
				overallSums.deliverablesSum += totalHours;
			}
		}

		overallSums.totalEfforts +=
			siteSums[siteName].pipingSum +
			siteSums[siteName].equipmentModellingSum +
			siteSums[siteName].adminSetupProposalSum +
			siteSums[siteName].deliverablesSum;
	}

	localStorage.setItem("siteSums", JSON.stringify(siteSums));

	console.log(subtotalLineCounts.textContent, "subtotallinecounts");
	// Calculate hours per line using subtotalLineCounts
	const hoursPerLinePiping =
		overallSums.pipingSum / subtotalLineCounts.textContent;
	const hoursPerLineEditModelling =
		overallSums.equipmentModellingSum / subtotalLineCounts.textContent;
	const hoursPerLineAdmin =
		overallSums.adminSetupProposalSum / subtotalLineCounts.textContent;
	const hoursPerLineDeliverables =
		overallSums.deliverablesSum / subtotalLineCounts.textContent;
	const totalEffortsPerLine =
		overallSums.totalEfforts / subtotalLineCounts.textContent;

	// Create HTML for the table
	let tableHTML = `
    <table>
        <thead>
            <tr>
                <th colspan="7">Efforts for Overall Project Execution</th>
            </tr>
            <tr>
                <th>Sr No</th>
                <th>Site Name</th>
                <th>Pipe Modeling</th>
                <th>Equipment Modeling</th>
                <th>Admin Setup & Proposal</th>
                <th>Deliverables</th>
                <th>Total Efforts</th>
            </tr>
        </thead>
        <tbody>`;

	let rowIndex = 1;

	// Add row with calculated sums for each site
	for (const siteName in siteSums) {
		const sums = siteSums[siteName];
		tableHTML += `
        <tr>
            <td>${rowIndex++}</td>
            <td>${siteName}</td>
            <td>${sums.pipingSum.toFixed(2)} </td>
            <td>${sums.equipmentModellingSum.toFixed(2)}</td>
            <td>${sums.adminSetupProposalSum.toFixed(2)}</td>
            <td>${sums.deliverablesSum.toFixed(2)}</td>
            <td>${(
							sums.pipingSum +
							sums.equipmentModellingSum +
							sums.adminSetupProposalSum +
							sums.deliverablesSum
						).toFixed(2)}</td>
        </tr>`;
	}

	// Add the subtotal row
	tableHTML += `
                <tr>
                <td colspan="2">Subtotal</td>
                <td>${overallSums.pipingSum.toFixed(2)} hr</td>
                <td>${overallSums.equipmentModellingSum.toFixed(2)} hr</td>
                <td>${overallSums.adminSetupProposalSum.toFixed(2)} hr</td>
                <td>${overallSums.deliverablesSum.toFixed(2)} hr</td>
                <td>${overallSums.totalEfforts.toFixed(2)} hr</td>
            </tr>
            <tr>
                <td colspan="2">Hours / Line</td>
                <td>${hoursPerLinePiping.toFixed(2)} hr</td>
                <td></td>
                <td></td>
                <td></td>
                <td>${totalEffortsPerLine.toFixed(2)} hr</td>
            </tr>
            <tr>
                <td colspan="2">Lines / day</td>
                <td>${(8 / hoursPerLinePiping).toFixed(2)} Lines</td>
                <td></td>
                <td></td>
                <td></td>
                <td>${(8 / totalEffortsPerLine).toFixed(2)} Lines</td>
            </tr>
            <tr>
                <td colspan="2">Days Required</td>
                <td>${(overallSums.pipingSum / 8).toFixed(1)} Days</td>
                <td></td>
                <td></td>
                <td></td>
                <td>${(overallSums.totalEfforts / 8).toFixed(1)} Days</td>
            </tr>

          
        `;

	tableHTML += `
        </tbody>
    </table>`;

	const container = document.getElementById("final-container");
	container.innerHTML = tableHTML;
	hasCalculatedTotalHours = true;
	return siteSums;
}

function scrollToTableContainer() {
	const tableContainer = document.getElementById("tableContainer");
	if (tableContainer) {
		tableContainer.scrollIntoView({ behavior: "smooth" });
	}
}

function scrollToFinalContainer() {
	const finalContainer = document.getElementById("final-container");
	if (finalContainer) {
		finalContainer.scrollIntoView({ behavior: "smooth" });
	}
}
// Define a mapping of regions to countries
const regionToCountries = {
	"North America": [
		"Antigua and Barbuda",
		"Bahamas",
		"Barbados",
		"Belize",
		"Canada",
		"Costa Rica",
		"Cuba",
		"Dominica",
		"Dominican Republic",
		"El Salvador",
		"Grenada",
		"Guatemala",
		"Haiti",
		"Honduras",
		"Jamaica",
		"Mexico",
		"Nicaragua",
		"Panama",
		"Saint Kitts and Nevis",
		"Saint Lucia",
		"Saint Vincent and the Grenadines",
		"Trinidad and Tobago",
		"United States",
	],
	"South America": [
		"Argentina",
		"Bolivia",
		"Brazil",
		"Chile",
		"Colombia",
		"Ecuador",
		"Guyana",
		"Paraguay",
		"Peru",
		"Suriname",
		"Uruguay",
		"Venezuela",
	],
	Europe: [
		"Albania",
		"Andorra",
		"Austria",
		"Belarus",
		"Belgium",
		"Bosnia and Herzegovina",
		"Bulgaria",
		"Croatia",
		"Cyprus",
		"Czech Republic",
		"Denmark",
		"Estonia",
		"Finland",
		"France",
		"Germany",
		"Greece",
		"Hungary",
		"Iceland",
		"Ireland",
		"Italy",
		"Kosovo",
		"Latvia",
		"Liechtenstein",
		"Lithuania",
		"Luxembourg",
		"Malta",
		"Moldova",
		"Monaco",
		"Montenegro",
		"Netherlands",
		"North Macedonia",
		"Norway",
		"Poland",
		"Portugal",
		"Romania",
		"Russia",
		"San Marino",
		"Serbia",
		"Slovakia",
		"Slovenia",
		"Spain",
		"Sweden",
		"Switzerland",
		"Ukraine",
		"United Kingdom",
		"Vatican City",
	],
	"Middle East": [
		"Afghanistan",
		"Armenia",
		"Azerbaijan",
		"Bahrain",
		"Bangladesh",
		"Bhutan",
		"Brunei",
		"Cambodia",
		"China",
		"Georgia",
		"India",
		"Indonesia",
		"Iran",
		"Iraq",
		"Israel",
		"Japan",
		"Jordan",
		"Kazakhstan",
		"Kuwait",
		"Kyrgyzstan",
		"Laos",
		"Lebanon",
		"Malaysia",
		"Maldives",
		"Mongolia",
		"Myanmar (Burma)",
		"Nepal",
		"North Korea",
		"Oman",
		"Pakistan",
		"Palestine",
		"Philippines",
		"Qatar",
		"Saudi Arabia",
		"Singapore",
		"South Korea",
		"Sri Lanka",
		"Syria",
		"Taiwan",
		"Tajikistan",
		"Thailand",
		"Timor-Leste",
		"Turkey",
		"Turkmenistan",
		"United Arab Emirates",
		"Uzbekistan",
		"Vietnam",
		"Yemen",
	],
	APAC: [
		"Australia",
		"Fiji",
		"Kiribati",
		"Marshall Islands",
		"Micronesia",
		"Nauru",
		"New Zealand",
		"Palau",
		"Papua New Guinea",
		"Samoa",
		"Solomon Islands",
		"Tonga",
		"Tuvalu",
		"Vanuatu",
	],
	India: ["India"],
};

// Function to generate estimate
// Function to generate estimate
function generateEstimate() {
	if (!hasCalculatedTotalHours) {
		alert("Please calculate total hours before generating the estimation.");
		return;
	}

	// Get the offcanvas content area
	const offcanvasContent = document.getElementById("offcanvasContent");

	// Define the forms to be inserted into the offcanvas
	const formHTML = `
        <form class="row g-3" id="clientDetailsForm">
            <!-- Client Contact and Designation on the same line -->
            <div class="col-md-6">
                <label for="clientName" class="form-label">Contact Person</label>
                <input type="text" class="form-control required-field" id="clientName" placeholder="Enter Name of Contact Person" required>
            </div>
            <div class="col-md-6">
                <label for="designation" class="form-label">Designation</label>
                <input type="text" class="form-control" id="designation" placeholder="Enter Designation">
            </div>

        <!-- Prospective Client and Project Name on the same line -->
            <div class="col-md-6">
                <label for="companyName" class="form-label">Prospective Client</label>
                <input type="text" class="form-control required-field" id="companyName" placeholder="Enter name of prospectus" required>
            </div>
            <div class="col-md-6">
                <label for="projectName" class="form-label">Project Name</label>
                <input type="text" class="form-control" id="projectName" placeholder="Enter project name">
            </div>

            <!-- Company Address -->
            <div class="col-12">
                <label for="companyAddress" class="form-label">Prospectus Address</label>
                <input type="text" class="form-control required-field" id="companyAddress" placeholder="Enter address" required>
            </div>

            <!-- Region and Country on the same line -->
            <div class="col-md-6">
                <label for="region" class="form-label">Region</label>
                <select class="form-control required-field" name="region" id="region" required onchange="updateCountryDropdown()">
                    <option value="" selected disabled>Select a region*</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Europe">Europe</option>
                    <option value="Middle East">Middle East</option>
                    <option value="APAC">APAC</option>
                    <option value="India">India</option>
                </select>
            </div>

            <div class="col-md-6">
                <label for="country" class="form-label">Country</label>
                <select class="form-control" id="country" required>
                    <option value="" selected disabled>Select a country</option>
                </select>
            </div>

            <!-- Postal Code and Phone on the same line -->
            <div class="col-md-6">
                <label for="postalCode" class="form-label">Postal Code</label>
                <input type="text" class="form-control" id="postalCode" placeholder="Enter postal code">
            </div>

            <div class="col-md-6">
                <label for="contactNumber" class="form-label">Phone</label>
                <input type="tel" class="form-control required-field" id="contactNumber" placeholder="Enter phone details" required>
            </div>

            <!-- Email Address and Website on the same line -->
            <div class="col-md-6">
                <label for="emailAddress" class="form-label">Email Address</label>
                <input type="email" class="form-control" id="emailAddress" placeholder="Enter email address">
            </div>

            <div class="col-md-6">
                <label for="website" class="form-label">Website</label>
                <input type="text" class="form-control" id="website" placeholder="Enter website address">
            </div>
        </form>

        <hr> <!-- Horizontal Rule as a Breakpoint -->

        <div>
            <!-- Neilsoft Representative Details Heading -->
            <h3>Neilsoft Representative Details</h3>
            
            <form class="row g-3" id="neilsoftDetailsForm">
                <!-- Neilsoft Representative Name and Designation on the same line -->
                <div class="col-md-6">
                    <label for="salesPersonName" class="form-label">Representative Name</label>
                    <input type="text" class="form-control" id="salesPersonName" placeholder="Representative name">
                </div>

                <div class="col-md-6">
                    <label for="salesPersonDesignation" class="form-label">Designation</label>
                    <input type="text" class="form-control" id="salesPersonDesignation" placeholder="Enter designation">
                </div>

                <!-- Phone and Email Address on the same line -->
                <div class="col-md-6">
                    <label for="neilsoftPhone" class="form-label">Phone Number</label>
                    <input type="tel" class="form-control" id="neilsoftPhone" placeholder="Enter phone number">
                </div>

                <div class="col-md-6">
                    <label for="neilsoftEmail" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="neilsoftEmail" placeholder="Enter email address">
                </div>

                <!-- Submit Button -->
                <div class="col-12">
                    <button type="button" class="btn btn-primary" onclick="saveFormDataAndNavigate()">Submit</button>
                </div>
            </form>
        </div>
    `;

	// Insert the forms into the offcanvas content area
	offcanvasContent.innerHTML = formHTML;

	// Get the offcanvas element
	const offcanvasElement = document.getElementById("offcanvasRight");

	// Create a new Bootstrap Offcanvas instance and show it
	const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
	offcanvas.show();
}

// Function to update country dropdown based on selected region
function updateCountryDropdown() {
	const regionSelect = document.getElementById("region");
	const countrySelect = document.getElementById("country");
	const selectedRegion = regionSelect.value;
	// Clear previous options
	countrySelect.innerHTML =
		'<option value="" selected disabled>Select a country</option>';

	// Populate country options based on selected region
	if (selectedRegion && regionToCountries[selectedRegion]) {
		regionToCountries[selectedRegion].forEach((country) => {
			const option = document.createElement("option");
			option.value = country;
			option.textContent = country;
			countrySelect.appendChild(option);
		});
	}
}

// Function to save form data and navigate to demoquote.html
// Function to save form data and navigate to demoquote.html
function saveFormDataAndNavigate() {
	// Get the forms
	const clientForm = document.getElementById("clientDetailsForm");
	const neilsoftForm = document.getElementById("neilsoftDetailsForm");

	// Validate both forms
	const isClientFormValid = clientForm.checkValidity();
	const isNeilsoftFormValid = neilsoftForm.checkValidity();
	const isValid = isClientFormValid && isNeilsoftFormValid;

	if (isValid) {
		// Get the form input values from client form
		const contactPerson = document.getElementById("clientName").value.trim();
		const designation = document.getElementById("designation").value.trim();
		const companyName = document.getElementById("companyName").value.trim();
		const projectName = document.getElementById("projectName").value.trim();
		const companyAddress = document
			.getElementById("companyAddress")
			.value.trim();
		const region = document.getElementById("region").value.trim();
		const country = document.getElementById("country").value.trim();
		const postalCode = document.getElementById("postalCode").value.trim();
		const contactNumber = document.getElementById("contactNumber").value.trim();
		const emailAddress = document.getElementById("emailAddress").value.trim();
		const website = document.getElementById("website").value.trim();

		// Get the form input values from neilsoft form
		const salesPersonName = document
			.getElementById("salesPersonName")
			.value.trim();
		const salesPersonDesignation = document
			.getElementById("salesPersonDesignation")
			.value.trim();
		const neilsoftPhone = document.getElementById("neilsoftPhone").value.trim();
		const neilsoftEmail = document.getElementById("neilsoftEmail").value.trim();

		// Store the form data in local storage
		localStorage.setItem(
			"formData",
			JSON.stringify({
				contactPerson,
				designation,
				companyName,
				projectName,
				companyAddress,
				region,
				country,
				postalCode,
				contactNumber,
				emailAddress,
				website,
				salesPersonName,
				salesPersonDesignation,
				neilsoftPhone,
				neilsoftEmail,
			})
		);

		// Navigate to demoquote.html
		window.location.href = "./html/demoquote.html";
	} else {
		// Report validity for both forms
		clientForm.reportValidity();
		neilsoftForm.reportValidity();
	}
}

function salesQuote() {
	console.log("Sales quote function executed.");
	// Additional processing logic can go here
}

// function showSelectedCells() {
//     const tableContainer = document.getElementById("tableContainer");

//     if (!tableContainer) {
//         console.error('Table container not found');
//         return;
//     }

//     // Clear any existing content in the table container
//     tableContainer.innerHTML = "";

//     // Retrieve current table rows
//     const tableBody = document.getElementById("inputRows");
//     const rows = Array.from(tableBody.querySelectorAll("tr"));

//     // Prepare updated data structure to store checkbox states
//     const updatedSiteData = {};

//     // Iterate over each row to capture checkbox states
//     rows.forEach((row) => {
//         const siteName = row.querySelector('input[name="siteName"]').value.trim();

//         if (!siteName) {
//             console.warn("Skipping a row with no site name");
//             return; // Skip rows with missing site names
//         }

//         const checkboxChecked = row.querySelector('input[type="checkbox"]').checked;

//         // Store checkbox state in updated data structure
//         updatedSiteData[siteName] = {
//             isChecked: checkboxChecked,
//             // Add other necessary data properties if needed
//         };
//     });

//     // Generate the component table with updated data including checkbox states
//     const componentTable = generateComponentTable(updatedSiteData);

//     // Append the component table to the table container
//     tableContainer.appendChild(componentTable);
// }
