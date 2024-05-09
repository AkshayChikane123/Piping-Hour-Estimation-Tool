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
    console.log("Saved Project Data:", projectData);

    // Trigger the function to calculate additional data
    selectionFactors(); 
}

// Add a default row when the page loads
document.addEventListener("DOMContentLoaded", () => {
    addRow(); // Add a blank row on page load
});

// SelectionFactors function to generate the component table
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
                estimatedTimes[component] = value * defaultTime;
            }
        }

        calculatedSiteData[siteName] = {
            calculatedData,
            estimatedTimes,
        };
    });

    // Generate and output the component table
    const componentTable = generateComponentTable(calculatedSiteData);

    const outputElement = document.getElementById("componentTableOutput"); // Element to hold the table
    if (outputElement) {
        outputElement.innerHTML = ""; // Clear existing content
        outputElement.appendChild(componentTable); // Add the generated table
    }
}

function generateComponentTable(calculatedSiteData) {
    const table = document.createElement("table");
    table.classList.add("styled-table"); // Optional: Apply a CSS class for styling

    // Create table header row
    const headerRow = document.createElement("tr");
    
    // Table headers: Section, Checkbox, Description, plus site-specific columns
    const headers = ["Section", "Checkbox", "Description"];
    headers.push(...Object.keys(calculatedSiteData)); // Site-specific headers

    headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Define the sections/components to be displayed in the table
    const sections = [
        { section: "Pipe Modelling Section", description: "Efforts for Volume Creation" },
        { section: "Pipe Modelling Section", description: "Efforts for Centreline Creation" },
        { section: "Pipe Modelling Section", description: "Creation of Line List" },
        { section: "Pipe Modelling Section", description: "Efforts for 3D Markups" },
        { section: "Pipe Modelling Section", description: "Efforts for 3D Modelling" },
        { section: "Equipment Modelling", description: "Efforts for Equipment Development" },
        { section: "Admin Setup & Proposal", description: "Admin Setup & Proposal" },
        { section: "Deliverables Section", description: "Plot Plan" },
        { section: "Deliverables Section", description: "Equipment Layouts" },
        { section: "Deliverables Section", description: "P&ID" },
        { section: "Deliverables Section", description: "PFD" },
        { section: "Deliverables Section", description: "Piping Isometrics" },
        { section: "Deliverables Section", description: "Bulk MTO" },
        { section: "Deliverables Section", description: "Equipment Tagging" },
        { section: "Deliverables Section", description: "Nozzle Orientations" },
    ];

    // Create rows for each section/component
    sections.forEach((sectionData) => {
        const row = document.createElement("tr");

        // Section name column
        const sectionCell = document.createElement("td");
        sectionCell.textContent = sectionData.section;
        row.appendChild(sectionCell);

        // Checkbox column
        const checkboxCell = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);

        // Description column
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = sectionData.description;
        row.appendChild(descriptionCell);

        // Site-specific columns for counts and times
        for (const siteName in calculatedSiteData) {
            const countTimeCell = document.createElement("td");
            const calculatedData = calculatedSiteData[siteName].calculatedData;
            const estimatedTimes = calculatedSiteData[siteName].estimatedTimes;

            const count = calculatedData[sectionData.description] || 0;
            const estimatedTime = estimatedTimes[sectionData.description] || 0;

            countTimeCell.textContent = `${count} Nos / ${estimatedTime} Min`;
            row.appendChild(countTimeCell);
        }

        table.appendChild(row); // Add the row to the table
    });

    return table;
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
