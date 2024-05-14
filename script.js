// Function to add a new row to the table
function addRow() {
    const tableBody = document.getElementById("inputRows");
    const rowCount = tableBody.childElementCount + 1; // Determine the next row number
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" name="siteName" placeholder="Site Name"></td>
        <td><input type="number" name="lineCounts[]" required min="1" onchange="defaultValues(this)"></td>
        <td><input type="number" name="totalExpectedPID" min="0"></td>
        <td><input type="number" name="sumBendsTeesReducers" min="0"></td>
        <td><input type="number" name="totalEquipments" min="0"></td>
        <td><input type="number" name="totalValves" min="0"></td>
        <td><input type="number" name="totalLineSegments" min="0"></td>
        <td><input type="number" name="pipeSupport" min="0"></td>
        <td>
            <button type="button" onclick="deleteRow(this)" class="btn-danger">Delete</button>
        </td>
    `;

    tableBody.appendChild(newRow); // Add the new row to the table
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

        const defaultTimes = {
            "Efforts for Volume Creation": 10,
            "Efforts for Centreline Creation": 10,
            "Creation of Line List": 15,
            "Efforts for 3D Markups": 10,
            "Efforts for 3D Modelling": 20,
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

    // Generate the dropdown container
    const dropdownContainer = generateDropdownContainer();

    // Get the container elements
    const tableContainer = document.getElementById("tableContainer");
    const dropdownContainerElement = document.getElementById("dropdownContainer");

    // Clear existing content
    if (tableContainer && dropdownContainerElement) {
        tableContainer.innerHTML = "";
        dropdownContainerElement.innerHTML = "";

        // Append the component table and dropdown container to the respective containers
        tableContainer.appendChild(componentTable);
        dropdownContainerElement.appendChild(dropdownContainer);
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

        [" Comp Count", "Default Time ( Min)", "Total Time (Hours)"].forEach((subHeader) => {
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
        { section: "Piping", description: "Efforts for Volume Creation" },
        { section: "Piping", description: "Efforts for Centreline Creation" },
        { section: "Piping", description: "Creation of Line List" },
        { section: "Piping", description: "Efforts for 3D Markups" },
        { section: "Piping", description: "Efforts for 3D Modelling" },
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

    return table; // Return the generated table
}


function generateDropdownContainer() {
    // Generate and append the dropdown container
    const dropdownContainer = document.createElement("div");
    dropdownContainer.classList.add("dropdown-container");

    // Create a header for the dropdown
    const dropdownHeader = document.createElement("h3");
    dropdownHeader.textContent = "Modelling Confirmations";
    dropdownHeader.style.textAlign = "center"; // Align the header text to center

    dropdownHeader.style.fontWeight = "bold"; // Make the header bold
    dropdownHeader.style.whiteSpace = "nowrap"; // Prevent text from wrapping



    dropdownContainer.appendChild(dropdownHeader);

    // Create dropdown elements
    const dropdownsForModConfirmations = [
        { name: '1) LOD of Modelling', options: ['LOD 100', 'LOD 200', 'LOD 300']},
        { name: '2) Pipe Support', options: ['Primary' ,'Out of Scope'] },
        { name: '3) Equipment Modelling', options: ['Yes', 'No', '50%'] },
        { name: '4) Specification Sheet', options: ['Yes', 'No'] }
    ];

    dropdownsForModConfirmations.forEach((dropdownData) => {
        // Create a label for the dropdown
        const dropdownLabel = document.createElement("label");
        dropdownLabel.textContent = dropdownData.name;
        dropdownContainer.appendChild(dropdownLabel);

        // Create the dropdown select element
        const dropdownSelect = document.createElement("select");
        dropdownData.options.forEach((option) => {
            const dropdownOption = document.createElement("option");
            dropdownOption.textContent = option;
            dropdownSelect.appendChild(dropdownOption);
        });
        dropdownContainer.appendChild(dropdownSelect);
    });

    return dropdownContainer;
}




function calculateTotalHours(siteDataArray) {

    // console.log("Saved Estimated Hours:", estimatedHours);
    
    // console.log("Saved Comp Count :", calculatedData);
    
    // console.log("Saved Site data Hours:",calculatedSiteData);
    // Initialize variables to store selected data and options
    const selectedData = siteDataArray || []; // Use provided site data or initialize as empty array
    let selectedOption;

    // Get the selected option from the dropdown
    selectedOption = document.querySelector("#dropdownContainer select").value;

    // Generate the HTML table structure
    let tableHTML = `
        <table>
           <thead>
            <tr> <th colspan="7" >Efforts for Overall Project Execution</tr></th>
                <tr>
                    <th>Sr No</th>
                    <th>Site Name</th>
                    <th>Efforts for Pipe Modeling</th>
                    <th>Efforts for Equipment Modeling</th>
                    <th>Efforts for Admin Setup & Proposal</th>
                    <th>Efforts for Deliverables</th>
                    <th>Total Efforts in Hours</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Iterate over each selected site
    selectedData.forEach((siteData, index) => {
        // Calculate total hours for the site based on selected option
        const totalHours = calculate(siteData, selectedOption);

        // Append a new row to the table
        tableHTML += `
            <tr>
                <td>${siteData.srNo}</td>
                <td>${siteData.siteName}</td>
                <td>{/* Efforts for Pipe Modeling calculation */}</td>
                <td>{/* Efforts for Equipment Modeling calculation */}</td>
                <td>{/* Efforts for Admin Setup & Proposal calculation */}</td>
                <td>{/* Efforts for Deliverables calculation */}</td>
                <td>${totalHours}</td>
            </tr>
        `;
    });

    // Close the HTML table structure
    tableHTML += `
            </tbody>
        </table>
    `;

    // Get the container element where you want to display the table
    const container = document.getElementById("final-container");

    // Insert the generated HTML table into the container
    container.innerHTML = tableHTML;
}

// Function to perform calculations using the selected data and option
function calculate(siteData, selectedOption) {
    // Perform your calculations here using the selectedData and selectedOption
    // Return the calculated result
    return 0; // Placeholder value, replace with actual calculation
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
