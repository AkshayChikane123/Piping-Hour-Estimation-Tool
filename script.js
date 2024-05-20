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

// // Add event listener to save settings button inside settings modal
// document.querySelector("#settingsModal .modal-footer .btn-primary").addEventListener("click", saveSettings);
// // Function to save settings and update defaultTimes object
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

    // Optionally, update any UI elements or notifications to indicate settings were saved
    // For example, you can display a notification using Bootstrap's alert

 

    // Optional: Trigger any recalculation functions if needed
    // For example:
    // selectionFactors();
    // generateComponentTable(calculatedSiteData); // Assuming calculatedSiteData is accessible

    // Optionally, provide feedback or notifications
    alert("Settings saved successfully!");
    
}
// Close the modal programmatically
const settingsModal = new bootstrap.Modal(document.getElementById("settingsModal"));
settingsModal.hide();


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

// Add a default row when the page loads
document.addEventListener("DOMContentLoaded", () => {
    addRow(); // Add a blank row on page load
});

function selectionFactors() {
    const calculatedSiteData = {}; // Store calculated data for each site

    const tableBody = document.getElementById("inputRows");
    const rows = Array.from(tableBody.querySelectorAll("tr"));

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
            "Pipe Supports": pipeSupport,
            "No of PMS (Spec Sheet)": lineCounts,
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
            const defaultTime = defaultTimes[component];
            if (defaultTime) {
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
    }
}

function generateComponentTable(calculatedSiteData) {
    // Function to calculate subtotal
    function calculateSubtotal() {
        // Iterate over each site
        for (const siteName in calculatedSiteData) {
            let totalCounts = 0;
            let totalEstimatedHours = 0;

            // Iterate over each section
            for (const sectionData of sections) {
                const count = calculatedSiteData[siteName].calculatedData[sectionData.description] || 0;
                const defaultTime = calculatedSiteData[siteName].estimatedTimes[sectionData.description] || defaultTimes[sectionData.description];
                const estimatedHours = (count * defaultTime) / 60;

                totalCounts += count;
                totalEstimatedHours += estimatedHours;
            }

            // Update the subtotal cells
            subtotalCells[siteName].count.textContent = totalCounts;
            subtotalCells[siteName].hours.textContent = totalEstimatedHours.toFixed(2);
        }
    }

    const table = document.createElement("table");
    table.classList.add("styled-table");

    // Create the main header row and the sub-header row for multi-level headers
    const mainHeaderRow = document.createElement("tr");
    const subHeaderRow = document.createElement("tr");

    // Main headers: #, Description, Section, Site Names with 3 sub-columns (Count, Default Time, Time in Hours)
    const mainHeaders = ["#", "Description", "Section"];
    mainHeaders.forEach((header) => {
        const th = document.createElement("th");
        th.rowSpan = 2; // These headers span 2 rows
        th.textContent = header;
        mainHeaderRow.appendChild(th);
    });

    // Site-specific headers with sub-columns for Count, Default Time, and Time in Hours
    const subtotalCells = {}; // Object to store subtotal cells for each site
    for (const siteName in calculatedSiteData) {
        const th = document.createElement("th");
        th.colSpan = 3; // Site header spans 3 columns
        th.textContent = siteName;
        mainHeaderRow.appendChild(th);

        [" Comp Count", "Time ( Min)", "Total Time (Hours)"].forEach((subHeader) => {
            const subTh = document.createElement("th");
            subTh.textContent = subHeader;
            subHeaderRow.appendChild(subTh);
        });

        // Create subtotal cells for each site
        const subtotalCountCell = document.createElement("td");
        const subtotalHoursCell = document.createElement("td");
        subtotalCells[siteName] = { count: subtotalCountCell, hours: subtotalHoursCell };
    }

    // Append the main header and the sub-header rows to the table
    table.appendChild(mainHeaderRow);
    table.appendChild(subHeaderRow);

    // Define the sections/components for the table
    const sections = [
        { section: "Piping", description: "Efforts for Volume Creation"},
        { section: "Piping", description: "Efforts for Centreline Creation" },
        { section: "Piping", description: "Creation of Line List" },
        { section: "Piping", description: "Efforts for 3D Markups" },
        { section: "Piping", description: "Efforts for 3D Modelling" },
        { section: "Piping", description: "Pipe Supports"}, 
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
    
        // Checkbox column
        const checkboxCell = document.createElement("td");
        const checkboxInput = document.createElement("input");
        checkboxInput.type = "checkbox";
        checkboxInput.classList.add("checkbox-input"); // Add a class for easier selection

        // To mark each checkbox true
        // checkboxInput.checked = true;
        
        
        // Check if the section is "Equipment Modelling"
        if (sectionData.section === "Equipment Modelling" || sectionData.section === "Admin Setup & Proposal") {
            checkboxInput.checked = true; // Mark checkbox as checked
        }
        

        // Set up event listener for the checkbox
        checkboxInput.addEventListener("change", function(event) {
            const isChecked = event.target.checked;
            // Perform calculations or execute logic based on checkbox state
            if (isChecked) {
                // Checkbox is checked, do something
            } else {
                // Checkbox is unchecked, do something else
            }
        });
        // checkboxInput.isChecked = true;
        checkboxCell.appendChild(checkboxInput);
        row.appendChild(checkboxCell);

        // Description column
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = sectionData.description;
        row.appendChild(descriptionCell);

        // Section name column
        const sectionCell = document.createElement("td");
        sectionCell.textContent = sectionData.section;
        row.appendChild(sectionCell);

        // Site-specific columns for Counts, Default Time (editable), and Time in Hours
        for (const siteName in calculatedSiteData) {
            const calculatedData = calculatedSiteData[siteName].calculatedData;
            const estimatedTimes = calculatedSiteData[siteName].estimatedTimes;

            const count = calculatedData[sectionData.description] || 0;
            const defaultTime = estimatedTimes[sectionData.description] || 0;
            const estimatedHours = ((count * defaultTime) / 60).toFixed(2);

            // Count column
            const countCell = document.createElement("td");
            countCell.textContent = count;
            row.appendChild(countCell);

            // Default Time column (editable)
            const defaultTimeCell = document.createElement("td");
            const defaultTimeInput = document.createElement("input");
            defaultTimeInput.type = "number";
            defaultTimeInput.value = defaultTime; // Display the current default time
            defaultTimeInput.min = 0; // Non-negative values
            defaultTimeInput.addEventListener("change", (event) => {
                const newDefaultTime = parseFloat(event.target.value);
                if (!isNaN(newDefaultTime) && newDefaultTime >= 0) {
                    // Recalculate the time in hours
                    const newEstimatedHours = ((count * newDefaultTime) / 60).toFixed(2);
                    estimatedTimes[sectionData.description] = newDefaultTime;
                    estimatedHoursCell.textContent = newEstimatedHours; // Update display

                    // Recalculate subtotal
                    calculateSubtotal();
                }
            });
            defaultTimeCell.appendChild(defaultTimeInput);
            row.appendChild(defaultTimeCell);

            // Estimated Time in Hours column
            const estimatedHoursCell = document.createElement("td");
            estimatedHoursCell.textContent = estimatedHours; // Display estimated hours
            row.appendChild(estimatedHoursCell);
        }

        table.appendChild(row); // Add the row to the table
    });

    // Create a subtotal row to sum the counts and estimated hours
    const subtotalRow = document.createElement("tr");

    // Empty cells for the first three columns
    ["", "", ""].forEach(() => {
        const emptyCell = document.createElement("td");
        subtotalRow.appendChild(emptyCell);
    });

  // Append subtotal cells to the subtotal row
for (const siteName in subtotalCells) {
    subtotalRow.appendChild(subtotalCells[siteName].count); // Count cell

    // Cell for displaying "Subtotal" text in the Default Time column
    const subtotalDefaultTimeCell = document.createElement("td");
    subtotalDefaultTimeCell.textContent = "Subtotal";
    subtotalRow.appendChild(subtotalDefaultTimeCell);

    subtotalRow.appendChild(subtotalCells[siteName].hours); // Hours cell
}


    table.appendChild(subtotalRow); // Add the subtotal row to the table

    // Calculate subtotal immediately after generating the table
    calculateSubtotal();
    // console.log(table);
    return table; // Return the generated table
}

function updateSelection() {
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
    const newObject = updateSelection();
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
        <td>${hoursPerLineEditModelling.toFixed(2)} hr</td>
        <td>${hoursPerLineAdmin.toFixed(2)} hr</td>
        <td>${hoursPerLineDeliverables.toFixed(2)} hr</td>
        <td>${totalEffortsPerLine.toFixed(2)} hr</td>
    </tr>
    <tr>
        <td colspan="2">Lines / day</td>
        <td>${(8 / hoursPerLinePiping).toFixed(2)} Lines</td>
            <td>${(8 / hoursPerLineEditModelling).toFixed(2)} Lines</td>
            <td>${(8 / hoursPerLineAdmin).toFixed(2)} Lines</td>
            <td>${(8 / hoursPerLineDeliverables).toFixed(2)} Lines</td>
            <td>${(8 / totalEffortsPerLine).toFixed(2)} Lines</td>
    </tr>
    <tr>
        <td colspan="2">Days Required</td>
        <td>${overallSums.pipingSum.toFixed(2)/8} Days</td>
            <td>${overallSums.equipmentModellingSum.toFixed(2)/8} Days</td>
            <td>${overallSums.adminSetupProposalSum.toFixed(2)/8} Days</td>
            <td>${overallSums.deliverablesSum.toFixed(2)/8} Days</td>
            <td>${overallSums.totalEfforts.toFixed(2)/8} Days</td>
    </tr>
          
        `;

    tableHTML += `
        </tbody>
    </table>`;

    const container = document.getElementById("final-container");
    container.innerHTML = tableHTML;
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

   

    <div class="col-12">
    <button type="button" class="btn btn-primary" 
      onclick="submitForm()">Submit</button> <!-- Updated to use an onclick event -->
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


function submitForm() {
    // Get the offcanvas form by ID
    const form = document.getElementById("salesForm");

    if (!form) {
        console.error("Form not found.");
        return; // Exit if form is not found
    }

    // Collect data from the form inputs
    const clientName = document.getElementById("clientName").value;
    const companyName = document.getElementById("companyName").value;
    const companyAddress = document.getElementById("companyAddress").value;
    const country = document.getElementById("country").value;
    const state = document.getElementById("state").value;
    const postalCode = document.getElementById("postalCode").value;
    const email = document.getElementById("emailAddress").value;
    const phone = document.getElementById("contactNumber").value;
    const salesPersonName = document.getElementById("salesPersonName").value;

    // Build query string with form data
    const queryParams = new URLSearchParams({
        clientName,
        companyName,
        companyAddress,
        country,
        state,
        postalCode,
        email,
        phone,
        salesPersonName,
    });

    // Open a new page with the form data passed via query parameters
    const newWindow = window.open(`quotation.html?${queryParams.toString()}`, "_blank");

    if (newWindow) {
        newWindow.focus(); // Focus on the new window
    }

    // Call the custom salesQuote function
    salesQuote();

    // Close the offcanvas
    const offcanvasElement = document.getElementById("offcanvasRight");
    if (offcanvasElement) {
        const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
        offcanvas.hide();
    }
}

function salesQuote() {
    console.log("Sales quote function executed.");
    // Additional processing logic can go here
}
