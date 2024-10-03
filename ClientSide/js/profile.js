let donor_id;
const fname = document.getElementById('savedFirstname');
const lname = document.getElementById('savedLastname');
const email = document.getElementById('savedEmail');
const phone = document.getElementById('savedPhone');
const username = document.getElementById('savedUsername');
window.addEventListener('DOMContentLoaded', function() 
{
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.readOnly = true);

    const updateButton = document.getElementById('updateButton');
    const confirmButton = document.getElementById('confirmDetails');
    confirmButton.style.display = 'none';

    updateButton.addEventListener('click', function()
    {
        inputs.forEach(input => input.readOnly = false);
        confirmButton.style.display = 'block';
        updateButton.style.display = 'none';
    });

    confirmButton.addEventListener('click', function(event)
    {
        event.preventDefault();
        updateDetailsInTable();
        inputs.forEach(input => input.readOnly = true);
        confirmButton.style.display = 'none';
        updateButton.style.display = 'block';
    });

    const helpButton = document.getElementById('helpButton');
    const helpModal = document.getElementById('helpModal');
    const closeModal = document.getElementById('closeModal');

    helpModal.setAttribute('inert', '');

    fetchProfileDetails();

    

    helpButton.addEventListener('click', function()
    {
        //show modal
        helpModal.style.display = 'block';
        helpModal.removeAttribute('inert');

        closeModal.addEventListener('click', function()
        {
        //hide modal
        helpModal.setAttribute('inert', '');
        helpModal.style.display = 'none';
        });

    });

    


});

function fetchProfileDetails()
{
    const savedUsername = sessionStorage.getItem('username');

    fetch('http://localhost:8383/api/getUserDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({savedUsername}),
    })
    .then(response => response.json())
    .then(data => {

        console.log('Success:', data);
        updateDetails(data);
        donor_id = data.donor_id;
    })
    .catch((error) => {
        console.error('Error:', error);
       
    });
      
    
}

function updateDetails(data)
{
    
    fname.value = data.first_name;
    lname.value = data.last_name;
    email.value = data.email;
    phone.value = data.phone_number;
    username.value = data.username;
}

function updateDetailsInTable()
{
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