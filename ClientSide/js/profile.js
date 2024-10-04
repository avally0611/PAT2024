let donor_id;

window.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeButtons();
    fetchProfileDetails();
});

//this function will initialize the form and set some variables to be used later
function initializeForm() {
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.readOnly = true);

    form.addEventListener('submit', function(event) {
        event.preventDefault();
    });
}

//this function will initialize the buttons and set the event listeners for them
function initializeButtons() {
    const updateButton = document.getElementById('updateButton');
    const confirmButton = document.getElementById('confirmDetails');
    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeModal = document.getElementById('closeModal');

    confirmButton.style.display = 'none';
    helpModal.setAttribute('inert', '');

    updateButton.addEventListener('click', handleUpdateButtonClick);
    confirmButton.addEventListener('click', handleConfirmButtonClick);
    helpButton.addEventListener('click', () => showHelpModal(helpModal, closeModal));
}

//this function will handle the update button click
function handleUpdateButtonClick() {
    const inputs = document.querySelectorAll('#profileForm input');
    const updateButton = document.getElementById('updateButton');
    const confirmButton = document.getElementById('confirmDetails');

    inputs.forEach(input => input.readOnly = false);
    confirmButton.style.display = 'block';
    updateButton.style.display = 'none';
}

//this function will handle the confirm button click
function handleConfirmButtonClick(event) {
    event.preventDefault();
    updateDetailsInTable();

    const inputs = document.querySelectorAll('#profileForm input');
    const updateButton = document.getElementById('updateButton');
    const confirmButton = document.getElementById('confirmDetails');

    inputs.forEach(input => input.readOnly = true);
    confirmButton.style.display = 'none';
    updateButton.style.display = 'block';
}

// this function will show the help modal
function showHelpModal(helpModal, closeModal) {
    helpModal.style.display = 'block';
    helpModal.removeAttribute('inert');

    closeModal.addEventListener('click', function() {
        helpModal.setAttribute('inert', '');
        helpModal.style.display = 'none';
    });
}

//this function will fetch the profile details
function fetchProfileDetails() {
    const savedUsername = sessionStorage.getItem('username');

    fetch('http://localhost:8383/api/getUserDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ savedUsername }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        populateInputFields(data);
        donor_id = data[0].donor_id;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

//this function will populate the input fields with the data fetched from the server
function populateInputFields(data) {
    const fname = document.getElementById('savedFirstname');
    const lname = document.getElementById('savedLastname');
    const email = document.getElementById('savedEmail');
    const phone = document.getElementById('savedPhone');
    const username = document.getElementById('savedUsername');

    fname.value = data[0].first_name;
    lname.value = data[0].last_name;
    email.value = data[0].email;
    phone.value = data[0].phone_number;
    username.value = data[0].username;
}

//this function will update the details in the table with new input
function updateDetailsInTable() {
    const fname = document.getElementById('savedFirstname');
    const lname = document.getElementById('savedLastname');
    const email = document.getElementById('savedEmail');
    const phone = document.getElementById('savedPhone');
    const username = document.getElementById('savedUsername');

    fetch('http://localhost:8383/api/updateDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            donor_id: donor_id,
            first_name: fname.value,
            last_name: lname.value,
            email: email.value,
            phone_number: phone.value,
            username: username.value
        }),
    })
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
        alert('Details updated successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
