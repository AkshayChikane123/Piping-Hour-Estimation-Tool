
// JavaScript code for adding, deleting, saving, and calculating rows dynamically
const inputRows = document.getElementById('inputRows');

// Function to add rows dynamically
function addRow() {
    const rowCount = inputRows.children.length;
    const srNo = rowCount + 1;
    const row = `
        <tr>
            <td>${srNo}</td>
            <td><input type="text" name="siteName[]" required></td>
            <td><input type="number" name="lineCounts[]" required min="0" onchange="calculateRow(this)"></td>
            <td><input type="number" name="expectedPID[]" ></td>
            <td><input type="number" name="bendsTeesReducer[]" ></td>
            <td><input type="number" name="totalEquipmentsPID[]" ></td>
            <td><input type="number" name="valvesPID[]" ></td>
          
            <td><input type="number" name="lineSegments[]" ></td>
            <td>
                <button type="button" class="btn btn-danger" onclick="deleteRow(this)">Delete</button>
                <button type="button" class="btn btn-save" onclick="saveRow(this)">Save</button>
            </td>
        </tr>
    `;
    inputRows.insertAdjacentHTML('beforeend', row);
}

// Function to delete row
function deleteRow(btn) {
    const row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);

    // Rearrange Sr No
    const rows = inputRows.children;
    for (let i = 0; i < rows.length; i++) {
        rows[i].children[0].textContent = i + 1;
    }
}

// Function to save row (for demonstration, it alerts the row data)
function saveRow(btn) {
    const row = btn.parentNode.parentNode;
    const rowData = Array.from(row.querySelectorAll('input')).map(input => input.value);
    alert('Saved Row Data:\n' + rowData.join('\n'));
}


function calculateRow(input) {
    const row = input.parentNode.parentNode;
    const lineCounts = parseInt(input.value);
    if (!isNaN(lineCounts)) {
        const expectedPID = Math.ceil(lineCounts / 2);
        const bendsTeesReducer = lineCounts * 6;
        const totalEquipmentsPID = Math.ceil(lineCounts * 0.4);
        const valvesPID = lineCounts * 3;
        const lineSegments = lineCounts + (lineCounts * 6) + (lineCounts * 3) ;

        // Update input values
        row.querySelector('input[name="expectedPID[]"]').value = expectedPID;
        row.querySelector('input[name="bendsTeesReducer[]"]').value = bendsTeesReducer;
        row.querySelector('input[name="totalEquipmentsPID[]"]').value = totalEquipmentsPID;
        row.querySelector('input[name="valvesPID[]"]').value = valvesPID;
        row.querySelector('input[name="lineSegments[]"]').value = lineSegments;
       
        // Return calculated values
        return {
            effortsForVolumeCreation: bendsTeesReducer + totalEquipmentsPID + valvesPID + lineSegments,
            effortsForCentrelineCreation: lineSegments,
            creationOfLineList: lineSegments,
            effortsFor3DMarkups: lineSegments,
            effortsFor3DModelling: lineSegments + bendsTeesReducer,
            effortsForEquipmentDevelopment: totalEquipmentsPID,
            adminSetupAndProposal: 60,
            plotPlan: lineCounts,
            equipmentLayouts: totalEquipmentsPID,
            pAndID: totalEquipmentsPID,
            pfd: 1,
            pipingIsometrics: lineCounts,
            bulkMTO: lineCounts,
            equipmentTagging: totalEquipmentsPID,
            nozzleOrientations: totalEquipmentsPID
        };
       
    }
}


// Declare variables to store values for each item
// let effortsForVolumeCreation = 0;
// let effortsForCentrelineCreation = 0;
// let creationOfLineList = 0;
// let effortsFor3DMarkups = 0;
// let effortsFor3DModelling = 0;
// let effortsForEquipmentDevelopment = 0;
// let adminSetupAndProposal = 0;
// let plotPlan = 0;
// let equipmentLayouts = 0;
// let pAndID = 0;
// let pfd = 0;
// let pipingIsometrics = 0;
// let bulkMTO = 0;
// let equipmentTagging = 0;
// let nozzleOrientations = 0;
//    Retrieve values from input fields
// const effortsForVolumeCreation = parseInt(document.querySelector('input[name="effortsForVolumeCreation"]').value);
// const effortsForCentrelineCreation = parseInt(document.querySelector('input[name="effortsForCentrelineCreation"]').value);
// const creationOfLineList = parseInt(document.querySelector('input[name="creationOfLineList"]').value);
// const effortsFor3DMarkups = parseInt(document.querySelector('input[name="effortsFor3DMarkups"]').value);
// const effortsFor3DModelling = parseInt(document.querySelector('input[name="effortsFor3DModelling"]').value);
// const effortsForEquipmentDevelopment = parseInt(document.querySelector('input[name="effortsForEquipmentDevelopment"]').value);
// const adminSetupAndProposal = parseInt(document.querySelector('input[name="adminSetupAndProposal"]').value);
// const plotPlan = parseInt(document.querySelector('input[name="plotPlan"]').value);
// const equipmentLayouts = parseInt(document.querySelector('input[name="equipmentLayouts"]').value);
// const pAndID = parseInt(document.querySelector('input[name="pAndID"]').value);
// const pfd = parseInt(document.querySelector('input[name="pfd"]').value);
// const pipingIsometrics = parseInt(document.querySelector('input[name="pipingIsometrics"]').value);
// const bulkMTO = parseInt(document.querySelector('input[name="bulkMTO"]').value);
// const equipmentTagging = parseInt(document.querySelector('input[name="equipmentTagging"]').value);
// const nozzleOrientations = parseInt(document.querySelector('input[name="nozzleOrientations"]').value);

// // Calculate total efforts for different tasks
// const pipeModelling = effortsForVolumeCreation + effortsForCentrelineCreation + creationOfLineList + effortsFor3DMarkups + effortsFor3DModelling;
// const equipmentModelling = effortsForEquipmentDevelopment;
// const adminSetupAndProposalTotal = adminSetupAndProposal;
// const deliverables = plotPlan + equipmentLayouts + pAndID + pfd + pipingIsometrics + bulkMTO + equipmentTagging + nozzleOrientations;

// // Populate the "Efforts for Overall Project Execution" table
// document.getElementById('pipeModelling').textContent = pipeModelling;
// document.getElementById('equipmentModelling').textContent = equipmentModelling;
// document.getElementById('adminSetupAndProposal').textContent = adminSetupAndProposalTotal;
// document.getElementById('deliverables').textContent = deliverables;
// document.getElementById('totalEfforts').textContent = pipeModelling + equipmentModelling + adminSetupAndProposalTotal + deliverables;






// Updated CODE
function selectRequiredDeliverables() {
    const deliverables = [
        'Inspection Isometrics', 'Plot Plan', '3d Model (.dwg)', '3d Model (.nwd)', 'P&ID Updation', 
        'P&ID Markups', 'P&ID (New) Creation', 'PFD', 'Equipment / Component Tagging', 
        'Bill Of Material', 'Equipment Layout', 'Piping Layout'
    ];

    const container = document.getElementById('deliverablesContainer');
    container.innerHTML = '';

    // Create header for deliverables
    const deliverablesHeader = document.createElement('h1');
    deliverablesHeader.textContent = 'Select Deliverables';
    container.appendChild(deliverablesHeader);

    // Populate deliverables
    deliverables.forEach((deliverable, index) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `deliverable-${index + 1}`;

        const label = document.createElement('label');
        label.htmlFor = `deliverable-${index + 1}`;
        label.textContent = deliverable;

        const div = document.createElement('div');
        div.classList.add('checkbox-container');
        div.appendChild(checkbox);
        div.appendChild(label);

        container.appendChild(div);
    });

    // Create dropdowns container
    const dropdownContainer = document.getElementById('dropdownContainer');
    dropdownContainer.innerHTML = '';

    // Create header for dropdowns
    const dropdownsHeader = document.createElement('h1');
    dropdownsHeader.textContent = 'Modelling Confirmations';
    dropdownContainer.appendChild(dropdownsHeader);

    // Create dropdown elements
    const dropdowns = [
        { name: '1) LOD of Modelling', options: ['LOD 100', 'LOD 200', 'LOD 300', 'LOD 400', 'LOD 500'] },
        { name: '2) Pipe Support', options: ['Primary', 'Secondary', 'Primary + Secondary', 'Out of Scope'] },
        { name: '3) Equipment Modelling', options: ['Yes', 'No', '50%'] },
        { name: '4) Specification Sheet', options: ['Yes', 'No'] }
    ];

    dropdowns.forEach(dropdown => {
        const dropdownDiv = document.createElement('div');
        dropdownDiv.classList.add('input-row'); // Add class for styling

        const dropdownLabel = document.createElement('label');
        dropdownLabel.textContent = dropdown.name;

        const select = document.createElement('select');
        dropdown.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });

        dropdownDiv.appendChild(dropdownLabel);
        dropdownDiv.appendChild(select);

        dropdownContainer.appendChild(dropdownDiv);
    });

    // Create form for input boxes

    
    const formContainer = document.createElement('div');
    formContainer.classList.add('form-container');

    const inputFields = ['Expected Count of Scans', 'Expected Count of ISO', 'Expected Count of P&ID for Updation'];

  
inputFields.forEach(input => {
    const inputDiv = document.createElement('div');
    inputDiv.classList.add('input-row'); // Add class for styling

    const label = document.createElement('label');
    label.textContent = input;

    const inputBox = document.createElement('input');
    inputBox.type = 'number';
    inputBox.classList.add('small-input'); // Add class for styling

    inputDiv.appendChild(label);
    inputDiv.appendChild(inputBox);

    formContainer.appendChild(inputDiv);
});

dropdownContainer.appendChild(formContainer);

const deliverableSection = document.getElementById('deliverableSection');
    deliverableSection.scrollIntoView({ behavior: 'smooth' });

}

// Floating Form for input to the calculate total hours button

// Function to generate the floating form table
function generateFloatingFormTable() {
    const floatingFormContainer = document.createElement('div');
    floatingFormContainer.classList.add('floating-form-container');

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tfoot = document.createElement('tfoot');

     // Table headers
     thead.innerHTML = `
     <tr>
         <th rowspan="2" style="text-align: center;">Sr No</th>
         <th rowspan="2" style="text-align: center;">Item Name</th>
         <th rowspan="2" style="text-align: center;">Category of Item name</th>
         <th colspan="2" style="text-align: center;">Time required for single item</th>
     </tr>
     <tr>
         <th style="text-align: center;">Value</th>
         <th style="text-align: center;">Unit</th>
     </tr>
 `;

 // Predefined names and default values for each row
 const itemData = [
     { name: 'Efforts for Volume Creation', category: 'Pipe Modelling Section', defaultTime: 10 },
     { name: 'Efforts for Centreline Creation', category: 'Pipe Modelling Section', defaultTime: 10 },
     { name: 'Creation of Line List', category: 'Pipe Modelling Section', defaultTime: 15 },
     { name: 'Efforts for 3D Markups', category: 'Pipe Modelling Section', defaultTime: 10 },
     { name: 'Efforts for 3d modelling', category: 'Pipe Modelling Section', defaultTime: 20 },
     { name: 'Efforts for Equipment Development', category: 'Equipment Modelling', defaultTime: 120 },
     { name: 'Admin Setup & Proposal', category: 'Admin Setup & Proposal', defaultTime: 30 },
     { name: 'Plot Plan', category: 'Deliverables Section', defaultTime: 180 },
     { name: 'Equipment Layouts', category: 'Deliverables Section', defaultTime: 60 },
     { name: 'P&ID', category: 'Deliverables Section', defaultTime: 180 },
     { name: 'PFD', category: 'Deliverables Section', defaultTime: 45 },
     { name: 'Piping Isometrics', category: 'Deliverables Section', defaultTime: 180 },
     { name: 'Bulk MTO', category: 'Deliverables Section', defaultTime: 120 },
     { name: 'EquipmentTagging', category: 'Deliverables Section', defaultTime: 10 },
     { name: 'Nozzle Orientations', category: 'Deliverables Section', defaultTime: 10 },
     // Add more rows as needed with their respective default values
 ];

 // Table rows with predefined names, categories, and default values
 itemData.forEach((item, index) => {
     const row = `
         <tr>
             <td style="text-align: center;">${index + 1}</td>
             <td>${item.name}</td>
             <td>${item.category}</td>
             <td><input type="text" value="${item.defaultTime}" data-default-time="${item.defaultTime}"></td>
             <td style="text-align: center;">min</td>
         </tr>
     `;
     tbody.innerHTML += row;
 });


    // Submit button
    tfoot.innerHTML = `
        <tr>
            <td colspan="3"><button type="button" onclick="submitFloatingForm()">Submit</button></td>
        </tr>
    `;

    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);

    floatingFormContainer.appendChild(table);

    document.body.appendChild(floatingFormContainer);

    // Adjust the position and dimensions of the floating form container
    floatingFormContainer.style.position = 'fixed';
    floatingFormContainer.style.top = '20%';
    floatingFormContainer.style.left = '30%';
    floatingFormContainer.style.width = '40%';
    floatingFormContainer.style.height = '70%';
    floatingFormContainer.style.backgroundColor = '#f2f2f2';
    floatingFormContainer.style.border = '1px solid black';
    floatingFormContainer.style.padding = '10px';
    floatingFormContainer.style.zIndex = '999';
    floatingFormContainer.style.overflow = 'auto';
}

// Function to submit the floating form
function submitFloatingForm() {
    // Logic to handle form submission
    // This is where you can further execute the logic for "Efforts for Overall Project Execution"
    // Once the submission is complete, you can remove or hide the floating form container
    const floatingFormContainer = document.querySelector('.floating-form-container');
    floatingFormContainer.remove();

    // Call the function to populate the "Efforts for Overall Project Execution" table
    populateEffortsTable();

    
}


// // Function to submit the floating form
// function submitFloatingForm() {
//     // Logic to handle form submission
//     // This is where you can further execute the logic for "Efforts for Overall Project Execution"
//     // Once the submission is complete, you can remove or hide the floating form container
//     const floatingFormContainer = document.querySelector('.floating-form-container');
//     floatingFormContainer.remove();

//     // Call the function to populate the "Efforts for Overall Project Execution" table
//     populateEffortsTable();

//     // Fill the input fields with data from the "Efforts for Overall Project Execution" table
//     fillInputFieldsFromEffortsTable();
// }

// // Function to fill input fields from the "Efforts for Overall Project Execution" table
// function fillInputFieldsFromEffortsTable() {
//     const pipeModelling = parseInt(document.getElementById('pipeModelling').textContent);
//     const equipmentModelling = parseInt(document.getElementById('equipmentModelling').textContent);
//     const adminSetupAndProposal = parseInt(document.getElementById('adminSetupAndProposal').textContent);
//     const deliverables = parseInt(document.getElementById('deliverables').textContent);

//     // Fill the input fields with the calculated values
//     document.querySelector('input[name="effortsForVolumeCreation"]').value = pipeModelling; // Adjust the input field name accordingly
//     document.querySelector('input[name="effortsForCentrelineCreation"]').value = pipeModelling; // Adjust the input field name accordingly
//     // Fill other input fields with respective values
// }




// Function to populate the "Efforts for Overall Project Execution" table
function populateEffortsTable() {
      // Get data from the first table (pipingForm)
    const pipingFormRows = document.querySelectorAll('#pipingForm tbody tr');
    
     // Array to store input values for each row
    const inputValues = [];

    

    // Create table HTML with headers
    let tableHTML = `
        <table>
            <caption><h2> Efforts for Overall Project Execution </h2></caption>
            <thead>
                <tr>
                    <th>Sr No</th>
                    <th>Site Name</th>
                    <th>Efforts for Pipe Modeling</th>
                    <th>Efforts for Equipment Modelling</th>
                    <th>Efforts for Admin Setup & Proposal</th>
                    <th>Efforts for Deliverables</th>
                    <th>Total efforts in Hours</th>
                </tr>
            </thead>
            <tbody>
    `;


    // Initialize variables to store calculated values
    // let totalPipeModelingEfforts = 0;
    // let totalEquipmentModellingEfforts = 0;
    // let totalAdminSetupAndProposalEfforts = 0;
    // let totalDeliverablesEfforts = 0;

    // Iterate over rows in the first table and populate the new table
    pipingFormRows.forEach((row, index) => {
        const siteName = row.querySelector('input[name="siteName[]"]').value;

        

        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${siteName}</td>
                <td><input type="number" name="pipeModelling[]" required></td>
                <td><input type="number" name="equipmentModelling[]" required></td>
                <td><input type="number" name="adminSetupAndProposal[]" required></td>
                <td><input type="number" name="deliverables[]" required></td>
                <td><input type="number" name="totalEfforts[]" readonly></td>
            </tr>
        `;
    });
       
     


    // Close table HTML
    tableHTML += `
            </tbody>
        </table>
    `;

    

    // Append the table to the section with ID "totalHoursSection"
    const totalHoursSection = document.getElementById('totalHoursSection');
    totalHoursSection.innerHTML = tableHTML;

    // Scroll to the section with ID "totalHoursSection"
    totalHoursSection.scrollIntoView({ behavior: 'smooth' });
}

// Event listener for the "Calculate Total Hours" button
const calculateTotalHoursButton = document.querySelector('.btn-calculate');
calculateTotalHoursButton.addEventListener('click', generateFloatingFormTable);

























// important logic for calculate total hours button and for the table of
//  *****Efforts for Overall Project Execution****


// // Function to calculate efforts for Pipe Modeling
// function calculatePipeModelingEfforts() {
//     // Logic to calculate efforts for Pipe Modeling-

//     return pipeModelingEfforts;
// }

// // Function to calculate efforts for Equipment Modelling
// function calculateEquipmentModellingEfforts() {
//     // Logic to calculate efforts for Equipment Modelling

//     equipmentModellingEfforts = effortsForEquipmentDevelopment;

//     return equipmentModellingEfforts;
// }

// // Function to calculate efforts for Admin Setup & Proposal
// function calculateAdminSetupAndProposalEfforts() {
//     // Logic to calculate efforts for Admin Setup & Proposal
    
//     return adminSetupAndProposalEfforts;
// }

// // Function to calculate efforts for Deliverables
// function calculateDeliverablesEfforts() {
//     // Logic to calculate efforts for Deliverables
//     return deliverablesEfforts;
// }

// Function to calculate total efforts in hours
// function calculateTotalEfforts() {
//     // Call individual calculation functions and sum up the efforts
//     const pipeModelingEfforts = calculatePipeModelingEfforts();
//     const equipmentModellingEfforts = calculateEquipmentModellingEfforts();
//     const adminSetupAndProposalEfforts = calculateAdminSetupAndProposalEfforts();
//     const deliverablesEfforts = calculateDeliverablesEfforts();

//     const totalEfforts = pipeModelingEfforts + equipmentModellingEfforts + adminSetupAndProposalEfforts + deliverablesEfforts;

//     return totalEfforts;
// }
