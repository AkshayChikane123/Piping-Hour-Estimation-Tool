/* Container Styling */
body {
    background-color: #e3edf7;
    font-family: Arial, sans-serif;
}

.container {
    width: 75%;
    margin: 20px auto;
    padding: 20px;
    border-radius: 5px;
    box-sizing: border-box;
    /* background-color: #e3edf7; */
    overflow-y: auto;
    flex-grow: 1;
    text-align: center;
}




.btn {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-primary,
.btn-save,
.btn-select,
.btn-calculate {
    background-color: #4CAF50;
    color: white;
}

.btn-estimate {
    background-color: #f0ad4e;
}

.btn-danger {
    background-color: #f37d74;
}


th,
td {
    padding: 10px;
    border: 1px solid #a09797;
    text-align: center;

}

th {
    /* width: 50px; */
    background-color: rgb(228, 202, 99);
    font-weight: 400;
}

/* Default Input Styling */
input[type="number"] {
    width: 90%;
    padding: 0px;
    text-align: center;
}

/* Class to highlight invalid input fields */
.invalid-input {
    border: 2px solid red;
}

/* Class to center text in input fields */
.centered-input {
    text-align: center;
    /* Center the text */
    padding: 5px;
    /* Add padding for better visual spacing */
}

#componentTableOutput {
    margin-top: 20px;
    padding: 10px;
    /* background: #f9f9f9; */
    /* Background for the output area */
}

table {
    table-layout: auto;
    /* Default layout for variable widths */
    border-collapse: collapse;
}

.styled-table {
    border: 1px solid #000;

    /* width: 75%; */
    margin: 20px auto;
    padding: 20px;
    border-radius: 25px;
    box-sizing: border-box;
    /* background-color: #fff; */
    flex-grow: 1;
    overflow-y: auto;
}
