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
        <td>
            <button type="button" onclick="deleteRow(this)" class="btn-danger">Delete</button>
        </td>
    `;

    tableBody.appendChild(newRow); // Add the new row to the table
    defaultValues(newRow.querySelector('input[name="lineCounts[]"]')); // Initialize default values for the first input
    updateSubtotalInput(); // Update subtotal immediately after adding the row
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
    const lineCounts = parseInt(input.value, 10); // Get the value of "Total Line Counts"

    if (isNaN(lineCounts) || lineCounts < 1) {
        return; // If not a valid number or less than 1, do nothing
    }

    // Calculate derived values based on the given logic
    const totalExpectedPID = Math.ceil(lineCounts / 2);
    const sumBendsTeesReducers = lineCounts * 6;
    const totalEquipments = Math.ceil(lineCounts * 0.4);
    const totalValves = lineCounts * 3;
    const totalLineSegments = lineCounts + (lineCounts * 6) + (lineCounts * 3);
    const pipeSupport = lineCounts * 5;

    // Update the corresponding fields in the same row
    row.querySelector('input[name="totalExpectedPID"]').value = totalExpectedPID;
    row.querySelector('input[name="sumBendsTeesReducers"]').value = sumBendsTeesReducers;
    row.querySelector('input[name="totalEquipments"]').value = totalEquipments;
    row.querySelector('input[name="totalValves"]').value = totalValves;
    row.querySelector('input[name="totalLineSegments"]').value = totalLineSegments;
    row.querySelector('input[name="pipeSupport"]').value = pipeSupport;
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

    rows.forEach((row) => {
        subtotalLineCounts += parseInt(row.querySelector('input[name="lineCounts[]"]').value, 10) || 0;
        subtotalExpectedPID += parseInt(row.querySelector('input[name="totalExpectedPID"]').value, 10) || 0;
        subtotalBendsTeesReducers += parseInt(row.querySelector('input[name="sumBendsTeesReducers"]').value, 10) || 0;
        subtotalEquipments += parseInt(row.querySelector('input[name="totalEquipments"]').value, 10) || 0;
        subtotalValves += parseInt(row.querySelector('input[name="totalValves"]').value, 10) || 0;
        subtotalLineSegments += parseInt(row.querySelector('input[name="totalLineSegments"]').value, 10) || 0;
        subtotalPipeSupport += parseInt(row.querySelector('input[name="pipeSupport"]').value, 10) || 0;
    });

    document.getElementById("subtotalLineCounts").textContent = subtotalLineCounts;
    document.getElementById("subtotalExpectedPID").textContent = subtotalExpectedPID;
    document.getElementById("subtotalBendsTeesReducers").textContent = subtotalBendsTeesReducers;
    document.getElementById("subtotalEquipments").textContent = subtotalEquipments;
    document.getElementById("subtotalValves").textContent = subtotalValves;
    document.getElementById("subtotalLineSegments").textContent = subtotalLineSegments;
    document.getElementById("subtotalPipeSupport").textContent = subtotalPipeSupport;
}

document.addEventListener('DOMContentLoaded', function() {
    const specSheetDropdown = document.getElementById('specSheetDropdown');
    const pipeSupportDropdown = document.getElementById('pipeSupportDropdown');
    const lodDropdown = document.getElementById('lodDropdown');
    const inputContainer = document.getElementById('inputContainer');
    let pmsInputValue = 0; // Initialize variable to store PMS input value
    let isPipeSupportOutOfScope = false; // Initialize variable to store Pipe Support state
    let selectedLOD = 'LOD 300'; // Initialize variable to store selected LOD

    specSheetDropdown.addEventListener('change', function() {
        // Clear any existing input field
        inputContainer.innerHTML = '';

        if (specSheetDropdown.value === 'Yes') {
            // Create a new label and input field
            const label = document.createElement('label');
            label.textContent = 'Enter No of PMS';

            const input = document.createElement('input');
            input.type = 'number';
            input.min = 0; // Ensure the number is non-negative
            input.placeholder = 'Number of PMS';
            input.addEventListener('input', function() {
                pmsInputValue = parseInt(input.value, 10) || 0; // Capture the input value
            });

            // Append the label and input to the container
            inputContainer.appendChild(label);
            inputContainer.appendChild(input);
        } else {
            pmsInputValue = 0; // Reset PMS input value if "No" is selected
        }
    });

    pipeSupportDropdown.addEventListener('change', function() {
        if (pipeSupportDropdown.value === 'Out of Scope') {
            isPipeSupportOutOfScope = true;
        } else {
            isPipeSupportOutOfScope = false;
        }
    });

    lodDropdown.addEventListener('change', function() {
        selectedLOD = lodDropdown.value;
    });

    // Store the PMS input value in a global variable for access in selectionFactors
    window.getPmsInputValue = function() {
        return pmsInputValue;
    };

    // Store the Pipe Support state in a global variable for access in selectionFactors
    window.getPipeSupportState = function() {
        return isPipeSupportOutOfScope;
    };

    // Store the selected LOD in a global variable for access in selectionFactors
    window.getSelectedLOD = function() {
        return selectedLOD;
    };
});

// Define defaultTimes globally or in a scope accessible by both setDefaultTime() and openSettingsModal()
let defaultTimes = {
    "Efforts for Volume Creation": 10,
    "Efforts for Centreline Creation": 10,
    "Creation of Line List": 15,
    "Efforts for 3D Markups": 10,
    "Efforts for 3D Modelling": 20,
    "Pipe Supports": 15,
    "No of PMS (Spec Sheet)": 480,
    "Efforts for Equipment Development": 120,
    "Admin Setup & Proposal": 30,
    "Plot Plan": 180,
    "Equipment Layouts": 60,
    "P&ID": 180,
    "PFD": 45,
    "Piping Isometrics": 180,
    "Bulk MTO": 20,
    "Equipment Tagging": 10,
    "Nozzle Orientations": 10,
};



// // Function to save settings for default and update defaultTimes object
function saveSettings() {
    const inputs = document.querySelectorAll("#settingsTable tbody input");
    // event.stopPropagation();
    inputs.forEach(input => {
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
    const settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"));
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
            const siteName = rowData['siteName'];
            projectData[siteName] = rowData; // Store rowData under the key of siteName
        }
    });

    if (hasEmptyFields) {
        alert("Please ensure all fields are filled in before saving.");
        return;
    }

    const siteNames = Object.keys(projectData);
    alert("Project data for the following sites has been saved:\n" + siteNames.join(", "));

    // Log the detailed data to the console
    console.log("Saved Primary Data:", projectData);

    // Trigger the function to calculate additional data
    selectionFactors(); 
}

function selectionFactors() {
    const calculatedSiteData = {}; // Store calculated data for each site

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

        const lineCounts = parseInt(row.querySelector('input[name="lineCounts[]"]').value, 10);
        const bendsTeesReducer = parseInt(row.querySelector('input[name="sumBendsTeesReducers"]').value, 10);
        const totalEquipments = parseInt(row.querySelector('input[name="totalEquipments"]').value, 10);
        const lineSegments = parseInt(row.querySelector('input[name="totalLineSegments"]').value, 10);
        const pipeSupport = parseInt(row.querySelector('input[name="pipeSupport"]').value, 10);


        const calculatedData = {
            "Efforts for Volume Creation": bendsTeesReducer + totalEquipments + lineSegments,
            "Efforts for Centreline Creation": lineSegments,
            "Creation of Line List": lineSegments,
            "Efforts for 3D Markups": lineSegments,
            "Efforts for 3D Modelling": lineSegments + bendsTeesReducer,
            "Pipe Supports": isPipeSupportOutOfScope ? 0 : pipeSupport, // Use 0 if out of scope
            "No of PMS (Spec Sheet)": pmsInputValue, // Use the PMS input value here
            "Efforts for Equipment Development": totalEquipments,
            "Admin Setup & Proposal": 60,
            "Plot Plan": lineCounts,
            "Equipment Layouts": totalEquipments,
            "P&ID": totalEquipments,
            "PFD": 1,
            "Piping Isometrics": lineCounts,
            "Bulk MTO": lineCounts,
            "Equipment Tagging": totalEquipments,
            "Nozzle Orientations": totalEquipments,
        };

        const estimatedTimes = {};
        for (const [component, value] of Object.entries(calculatedData)) {
            let defaultTime = defaultTimes[component];
            if (defaultTime) {
                // Apply LOD multiplier only to the time calculation of "Efforts for Equipment Development"
                if (component === "Efforts for Equipment Development") {
                    switch (selectedLOD) {
                        case 'LOD 200':
                            defaultTime *= 0.8;
                            break;
                        case 'LOD 100':
                            defaultTime *= 0.5;
                            break;
                        case 'LOD 300':
                        default:
                            defaultTime *= 1;
                            break;
                    }
                }
                estimatedTimes[component] = defaultTime;
            }
        }

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
        const buttonContainer = document.createElement('div');
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

    // Function to calculate subtotal for each site
    function calculateSubtotal() {
        for (const siteName in calculatedSiteData) {
            let totalCounts = 0;
            let totalEstimatedHours = 0;

            for (const sectionData of sections) {
                const count = calculatedSiteData[siteName].calculatedData[sectionData.description] || 0;
                const defaultTime = calculatedSiteData[siteName].estimatedTimes[sectionData.description] || defaultTimes[sectionData.description];
                const checkbox = document.querySelector(`input[data-section="${sectionData.description}"][data-site="${siteName}"]`);
                const isChecked = checkbox ? checkbox.checked : false;
                const estimatedHours = isChecked ? (count * defaultTime) / 60 : 0;

                totalCounts += count;
                totalEstimatedHours += estimatedHours;
            }

            subtotalCells[siteName].count.textContent = totalCounts;
            subtotalCells[siteName].hours.textContent = totalEstimatedHours.toFixed(2);
        }
    }

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
        subtotalCells[siteName] = { count: subtotalCountCell, hours: subtotalHoursCell };
    }

    table.appendChild(mainHeaderRow);
    table.appendChild(subHeaderRow);

    const sections = [
        { section: "Piping", description: "Efforts for Volume Creation" },
        { section: "Piping", description: "Efforts for Centreline Creation" },
        { section: "Piping", description: "Creation of Line List" },
        { section: "Piping", description: "Efforts for 3D Markups" },
        { section: "Piping", description: "Efforts for 3D Modelling" },
        { section: "Piping", description: "Pipe Supports" },
        { section: "Piping", description: "No of PMS (Spec Sheet)" },
        { section: "Equipment Modelling", description: "Efforts for Equipment Development" },
        { section: "Admin Setup & Proposal", description: "Admin Setup & Proposal" },
        { section: "Deliverables", description: "Plot Plan" },
        { section: "Deliverables", description: "Equipment Layouts" },
        { section: "Deliverables", description: "P&ID" },
        { section: "Deliverables", description: "PFD" },
        { section: "Deliverables", description: "Piping Isometrics" },
        { section: "Deliverables", description: "Bulk MTO" },
        { section: "Deliverables", description: "Equipment Tagging" },
        { section: "Deliverables", description: "Nozzle Orientations" },
    ];

    sections.forEach((sectionData, index) => {
        const row = document.createElement("tr");

        const checkboxCell = document.createElement("td");
        const checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.classList.add("checkbox-input");
        checkboxInput.dataset.section = sectionData.description;

        if (sectionData.section === "Equipment Modelling" || sectionData.section === "Admin Setup & Proposal") {
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
                    const estimatedHoursCell = document.querySelector(`td[data-section="${sectionData.description}"][data-site="${siteName}"]`);
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
            estimatedHoursCell.textContent = checkboxInput.checked ? estimatedHours : "0.00";
            row.appendChild(estimatedHoursCell);

            checkboxInput.addEventListener("change", function (event) {
                const isChecked = event.target.checked;
                const newEstimatedHours = ((count * (estimatedTimes[sectionData.description] || 0)) / 60).toFixed(2);
                estimatedHoursCell.dataset.estimatedHours = newEstimatedHours;
                estimatedHoursCell.textContent = isChecked ? newEstimatedHours : "0.00";
                console.log(`Estimated hours for ${sectionData.description} at ${siteName}: ${estimatedHoursCell.textContent}`);
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

    calculateSubtotal(); // Calculate subtotal initially
    return table;
}




function overallEffortTable() {
    let table = document.querySelector('.styled-table');
    let siteData = {}; // Object to store site data

    // Iterate over each row of the table
    table.querySelectorAll('tr').forEach(function(row, rowIndex) {
        if (rowIndex > 1) { // Skip header rows (index 0 and 1)
            let cells = row.querySelectorAll('td');

            // Check if the checkbox in the current row is checked
            let checkbox = cells[0].querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                // Extract fixed data from cells
                let description = cells[1].textContent.trim();
                let section = cells[2].textContent.trim();

                // Initialize siteData object for the current site
                for (let colIndex = 3; colIndex < cells.length; colIndex += 3) {
                    // Extract site name from corresponding header cell
                    let siteName = table.querySelector('th:nth-child(' + (colIndex / 3 + 3) + ')').textContent.trim();

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
                            totalHours: 0
                        };
                    }

                    siteData[siteName][description].count += count;
                    siteData[siteName][description].totalHours += totalHours;
                }
            }
        }
    });

    console.log('Site Data:', siteData);
    return siteData;
}

function calculateTotalHours() {
    const newObject = overallEffortTable();
    console.log(newObject, 'newOBJECT');

    let siteSums = {};
    let overallSums = {
        pipingSum: 0,
        equipmentModellingSum: 0,
        adminSetupProposalSum: 0,
        deliverablesSum: 0,
        totalEfforts: 0
    };

    // Initialize sums for each site
    for (const siteName in newObject) {
        siteSums[siteName] = {
            pipingSum: 0,
            equipmentModellingSum: 0,
            adminSetupProposalSum: 0,
            deliverablesSum: 0
        };

        // Iterate over each section in the site
        for (const description in newObject[siteName]) {
            const section = newObject[siteName][description].section;
            const totalHours = newObject[siteName][description].totalHours;

            if (section.includes('Piping')) {
                siteSums[siteName].pipingSum += totalHours;
                overallSums.pipingSum += totalHours;
            } else if (section.includes('Equipment Modelling')) {
                siteSums[siteName].equipmentModellingSum += totalHours;
                overallSums.equipmentModellingSum += totalHours;
            } else if (section.includes('Admin Setup & Proposal')) {
                siteSums[siteName].adminSetupProposalSum += totalHours;
                overallSums.adminSetupProposalSum += totalHours;
            } else if (section.includes('Deliverables')) {
                siteSums[siteName].deliverablesSum += totalHours;
                overallSums.deliverablesSum += totalHours;
            }
        }

        overallSums.totalEfforts += siteSums[siteName].pipingSum + siteSums[siteName].equipmentModellingSum + siteSums[siteName].adminSetupProposalSum + siteSums[siteName].deliverablesSum;
    }
    
    localStorage.setItem('siteSums', JSON.stringify(siteSums));

    console.log(subtotalLineCounts.textContent, 'subtotallinecounts');
     // Calculate hours per line using subtotalLineCounts
     const hoursPerLinePiping = overallSums.pipingSum / subtotalLineCounts.textContent;
     const hoursPerLineEditModelling = overallSums.equipmentModellingSum / subtotalLineCounts.textContent;
     const hoursPerLineAdmin = overallSums.adminSetupProposalSum / subtotalLineCounts.textContent;
     const hoursPerLineDeliverables = overallSums.deliverablesSum / subtotalLineCounts.textContent;
     const totalEffortsPerLine = overallSums.totalEfforts / subtotalLineCounts.textContent;
 

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
            <td>${(sums.pipingSum + sums.equipmentModellingSum + sums.adminSetupProposalSum + sums.deliverablesSum).toFixed(2)}</td>
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
    return siteSums;
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


  function generateEstimate() {
            // Get the offcanvas content area
            const offcanvasContent = document.getElementById("offcanvasContent");

            // Define the form to be inserted into the offcanvas
            const formHTML = `
            <form class="row g-3">
              <!-- Client Name -->
              <div class="col-12">
                <label for="clientName" class="form-label">Client Name</label>
                <input type="text" class="form-control" id="clientName" placeholder="Enter client's name">
              </div>
              <!-- Company Name -->
              <div class="col-12">
                <label for="companyName" class="form-label">Company Name</label>
                <input type="text" class="form-control" id="companyName" placeholder="Enter company name">
              </div>
              <!-- Company Address -->
              <div class="col-12">
                <label for="companyAddress" class="form-label">Company Address</label>
                <input type="text" class="form-control" id="companyAddress" placeholder="Enter company address">
              </div>
              <!-- Country, State, and Postal Code -->
              <div class="col-md-4">
                <label for="country" class="form-label">Country</label>
                <input type="text" class="form-control" id="country" placeholder="Enter country">
              </div>
              <div class="col-md-4">
                <label for="state" class="form-label">State</label>
                <input type="text" class="form-control" id="state" placeholder="Enter state">
              </div>
              <div class="col-md-4">
                <label for="postalCode" class="form-label">Postal Code</label>
                <input type="text" class="form-control" id="postalCode" placeholder="Enter postal code">
              </div>
              <!-- Email Address -->
              <div class="col-12">
                <label for="emailAddress" class="form-label">Email Address</label>
                <input type="email" class="form-control" id="emailAddress" placeholder="Enter email address">
              </div>
              <!-- Contact Number -->
              <div class="col-12">
                <label for="contactNumber" class="form-label">Contact Number</label>
                <input type="tel" class="form-control" id="contactNumber" placeholder="Enter contact number">
              </div>
              <!-- Neilsoft Salesperson Name -->
              <div class="col-12">
                <label for="salesPersonName" class="form-label">Neilsoft Salesperson Name</label>
                <input type="text" class="form-control" id="salesPersonName" placeholder="Enter salesperson's name">
              </div>
              <!-- Submit Button -->
              <div class="col-12">
                <button type="button" class="btn btn-primary" onclick="saveFormDataAndNavigate()">Submit</button>
              </div>
            </form>
            `;

            // Insert the form into the offcanvas content area
            offcanvasContent.innerHTML = formHTML;

            // Get the offcanvas element
            const offcanvasElement = document.getElementById("offcanvasRight");

            // Create a new Bootstrap Offcanvas instance and show it
            const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
            offcanvas.show();
        }
 function saveFormDataAndNavigate() {
            // Get the form input values
            const companyName = document.getElementById('companyName').value;
            const contact = document.getElementById('clientName').value;
            const companyAddress = document.getElementById('companyAddress').value;
            const country = document.getElementById('country').value;
            const state = document.getElementById('state').value;
            const postalCode = document.getElementById('postalCode').value;
            const contactNumber = document.getElementById('contactNumber').value;
            const emailAddress = document.getElementById('emailAddress').value;
            const salesPersonName = document.getElementById('salesPersonName').value;

            // Store the form data in local storage
            localStorage.setItem('formData', JSON.stringify({
                companyName,
                contact,
                companyAddress,
                country,
                state,
                postalCode,
                contactNumber,
                emailAddress,
                salesPersonName
            }));

            // Navigate to demoquote.html
            window.location.href = './html/demoquote.html';
        }
// function submitForm() {
//     // Get the offcanvas form by ID
//     const form = document.getElementById("salesForm");

//     if (!form) {
//         console.error("Form not found.");
//         return; // Exit if form is not found
//     }

//     // Collect data from the form inputs
//     const clientName = document.getElementById("clientName").value;
//     const companyName = document.getElementById("companyName").value;
//     const companyAddress = document.getElementById("companyAddress").value;
//     const country = document.getElementById("country").value;
//     const state = document.getElementById("state").value;
//     const postalCode = document.getElementById("postalCode").value;
//     const email = document.getElementById("emailAddress").value;
//     const phone = document.getElementById("contactNumber").value;
//     const salesPersonName = document.getElementById("salesPersonName").value;

//     // Build query string with form data
//     const queryParams = new URLSearchParams({
//         clientName,
//         companyName,
//         companyAddress,
//         country,
//         state,
//         postalCode,
//         email,
//         phone,
//         salesPersonName,
//     });

//     // Open a new page with the form data passed via query parameters
//     const newWindow = window.open(`quotation.html?${queryParams.toString()}`, "_blank");

//     if (newWindow) {
//         newWindow.focus(); // Focus on the new window
//     }

//     // Call the custom salesQuote function
//     salesQuote();

//     // Close the offcanvas
//     const offcanvasElement = document.getElementById("offcanvasRight");
//     if (offcanvasElement) {
//         const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
//         offcanvas.hide();
//     }
// }

function salesQuote() {
    console.log("Sales quote function executed.");
    // Additional processing logic can go here
}
