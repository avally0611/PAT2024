let donor_id;
window.addEventListener('DOMContentLoaded', function() 
{
    const form = document.getElementById('profileForm');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.readOnly = true);

    const updateButton = document.getElementById('updateButton');
    const confirmButton = document.getElementById('confirmDetails');
    confirmButton.style.display = 'none';
    form.addEventListener('submit', function(event) {
        event.preventDefault();
    });
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
        donor_id = data[0].donor_id;
    })
    .catch((error) => {
        console.error('Error:', error);
       
    });
      
    
}

function updateDetails(data)
{
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

function updateDetailsInTable()
{
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