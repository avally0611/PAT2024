let selectedCharity;
const donateButton = document.getElementById('donate-button');
donateButton.addEventListener('click', donateButtonClicked);

const amount = document.getElementById('donationAmount');

const dropdown = document.getElementById('dropdown-menu');

// This function will set the selected charity to the one that is clicked
function setupDropdownClickListener() {
    dropdown.addEventListener('click', function(event){
        // Get the text of the clicked item
        selectedText = event.target.innerText;
        console.log(selectedText);
        // Set the selected charity
        selectedCharity = selectedText;
    });
}

window.addEventListener('load', function () {
    console.log('All assets are loaded');
    // Fetch charities and populate the dropdown
    fetchCharitiesforDropdown();
    // Set up the click listener for the dropdown
    setupDropdownClickListener();
});


// Fetches the list of charities from the server and populates the dropdown
function fetchCharitiesforDropdown() {
    fetch('http://localhost:8383/api/charities')
        .then(response => response.json())
        .then(data => {
            // Create the dropdown items with the fetched data
            createCharityDropdown(data);
        })
        .catch(error => {
            console.error('Error: Trying to get data from server', error);
        });
}

// Creates the charity dropdown items
// charities: Array of charity objects
function createCharityDropdown(charities){
    const container = document.getElementById('dropdown-menu');
    // Iterate over each charity and create a dropdown item
    Array.from(charities).forEach(charity => {
        const listDropdown = document.createElement('li');
        listDropdown.innerHTML = charity.name;
        listDropdown.className = 'dropdown-item';
        // Append the item to the dropdown container
        container.append(listDropdown);
    });

    // Set up the search functionality
    searchCharity();
}

// Sets up the search functionality for the charity dropdown
function searchCharity(){
    var inputField = document.getElementById('searchInput');
    const dropdown = document.getElementById('dropdown-menu');
    // Get all the list items from the dropdown
    var charities = dropdown.querySelectorAll('li');
    console.log(charities);

    // Add an event listener to the input field for the keyup event
    inputField.addEventListener('keyup', function() {
        // Call the search algorithm with the current input value
        searchComboBox(inputField.value.toLowerCase(), charities);
    });
}

// Filters the dropdown items based on the input
// input: The current input value
// charities: Array of charity list items
function searchComboBox(input, charities){
    // Iterate over each charity item
    Array.from(charities).forEach(charity => {
        if(charity.innerText != '') {
            // Check if the charity name includes the input value
            if (charity.innerText.toLowerCase().includes(input)) {
                console.log('match');
                // Make the item visible
                charity.style.display = '';
            } else {
                // Hide the item
                charity.style.display = 'none';
                console.log('no match');
            }
        }
    });
}

// Handles the donate button click event
function donateButtonClicked() {
    console.log(selectedCharity);

    // Check if a charity is selected
    if (!selectedCharity) {
        alert('Please select a charity before donating.');
        return;
    }

    // Create the donation object
    const monetaryDonation = {
        charity: selectedCharity,
        amount: parseInt(amount.value)
    };

    // Store the donation object in session storage
    sessionStorage.setItem('monetaryDonation', JSON.stringify(monetaryDonation));
    
    // Redirect to the payment page
    window.location.href = "payment.html";
}
