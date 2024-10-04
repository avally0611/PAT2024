const donationItemsArr = [];

// Event listener for window load
window.addEventListener('load', function () {
    console.log('All assets are loaded');

    initializeButtons(); // Initialize buttons
    fetchRequests(); // Fetch requests from server
});

// Function to initialize buttons
function initializeButtons() {
    const helpModal = document.getElementById('helpModal');
    const closeModal = document.getElementById('closeModal');
    const helpButton = document.getElementById('helpButton');

    helpModal.setAttribute('inert', ''); // Set modal to inert initially
    helpButton.addEventListener('click', () => showHelpModal(helpModal, closeModal)); // Show help modal on button click
}

// Function to show help modal
// Parameters: helpModal (modal element), closeModal (close button element)
function showHelpModal(helpModal, closeModal) {
    helpModal.style.display = 'block'; // Display modal
    helpModal.removeAttribute('inert'); // Remove inert attribute

    closeModal.addEventListener('click', function() {
        helpModal.setAttribute('inert', ''); // Set modal to inert
        helpModal.style.display = 'none'; // Hide modal
    });
}

// Function to fetch requests from server
function fetchRequests() {
    fetch('http://localhost:8383/api/requests')
        .then(response => response.json()) // Parse JSON response
        .then(data => {
            createRequestTables(data); // Create tables with fetched data
        })
        .catch(error => {
            console.error('Error: Trying to get data from server', error); // Log error
        });
}

// Function to create tables for each charity and their requests
// Parameters: donations_needed (array of donation objects)
function createRequestTables(donations_needed) {
    const container = document.getElementById('requests-container');

    // Iterate over each donation needed
    donations_needed.forEach(dn => {
        console.log(dn);    
        const tableHeading = document.createElement('h2');
        tableHeading.textContent = dn.name;
        tableHeading.classList.add('table-text');

        const table = document.createElement('table');
        table.classList.add('table', 'table-scrollable', 'table-hover', 'table-bordered');

        const thead = document.createElement('thead');
        const rowHeader = document.createElement('tr');
        const headers = ['Item Name', 'Quantity Needed', 'Donate'];

        // Create table headers
        headers.forEach(header => {
            const th = document.createElement('th');
            th.scope = 'col';
            th.textContent = header;
            rowHeader.appendChild(th);
        });

        thead.appendChild(rowHeader);
        table.appendChild(thead);

        const tableBody = document.createElement('tbody');
        tableBody.classList.add('table-body');

        // Iterate over each request
        dn.requests.forEach(request => {
            const rowBody = document.createElement('tr');
            rowBody.classList.add('table-row');

            const itemName = document.createElement('td');
            itemName.textContent = request.item_name;

            const quantity = document.createElement('td');
            quantity.textContent = request.quantity;
            
            const button = document.createElement('button');
            button.textContent = 'Send to cart';
            button.classList.add('tableButton');

            const buttonCell = document.createElement('td');
            buttonCell.appendChild(button);

            const quantityChanger = document.createElement('input');
            quantityChanger.classList.add('quantity-input');
            quantityChanger.id = 'quantityInput';
            quantityChanger.type = 'number';
            quantityChanger.min = 1;
            quantityChanger.max = request.quantity;
            quantityChanger.value = 1;

            // Add event listener to quantity changer
            quantityChanger.addEventListener('keyup', function() {
                checkQuantity(quantityChanger.max); // Check quantity
                if (quantityChanger.value === '') {
                    quantityChanger.value = 1; // Set default value
                }
            });

            // Add event listener to button
            button.addEventListener('click', function() {
                sendToCart(dn.name, request.item_name, parseInt(quantityChanger.max), parseInt(quantityChanger.value), request.request_id); // Send to cart
            });

            // Append elements to row
            rowBody.appendChild(itemName);
            rowBody.appendChild(quantity);
            rowBody.appendChild(quantityChanger);
            rowBody.appendChild(buttonCell);

            // Append row to table body
            tableBody.appendChild(rowBody);
        });

        // Append table body and heading to container
        table.appendChild(tableBody);
        container.appendChild(tableHeading);
        container.appendChild(table);
    });

    search(); // Initialize search functionality
}

// Function to check if quantity entered is greater than max
// Parameters: max (maximum quantity)
function checkQuantity(max) {
    console.log('Checking quantity');
    var quantity = parseInt(document.getElementById('quantityInput').value);
    console.log(quantity, max);

    if (quantity > max) {
        document.getElementById('quantityInput').value = max; // Set value to max if exceeded
    }
}

// Function to send item to cart
// Parameters: charity_name (name of charity), item_name (name of item), donation_quantity_needed (quantity needed), donation_quantity (quantity to donate), request_id (ID of request)
function sendToCart(charity_name, item_name, donation_quantity_needed, donation_quantity, request_id) {
    const numItems = parseInt(document.getElementById('cart-num-items').textContent);
    sessionStorage.setItem('numCartItems', numItems + donation_quantity); // Update number of items in cart
    document.getElementById('cart-num-items').textContent = numItems + donation_quantity;

    const donationItem = {
        charity_name: charity_name,
        item_name: item_name,
        donation_quantity_needed: donation_quantity_needed,
        request_id: request_id,
        donation_quantity: donation_quantity
    };

    var donationItemsArr = JSON.parse(sessionStorage.getItem('donationItemsArr'));

    if (donationItemsArr == null) {
        donationItemsArr = []; // Initialize array if null
    }

    // Check if item already exists in array
    var indexFound = itemExistsInArr(charity_name, item_name, donationItemsArr);
    if (indexFound != -1) {
        donationItemsArr[indexFound].donation_quantity += donation_quantity; // Increase quantity if item exists
    } else {
        donationItemsArr.push(donationItem); // Add new item to array
    }

    sessionStorage.setItem('donationItemsArr', JSON.stringify(donationItemsArr)); // Save array to session storage
}

// Function to check if an item already exists in the array
// Parameters: charity_name (name of charity), item_name (name of item), donationItemsArr (array of donation items)
// Returns: index of item if found, -1 if not found
function itemExistsInArr(charity_name, item_name, donationItemsArr) {
    for (var i = 0; i < donationItemsArr.length; i++) {
        if (item_name == donationItemsArr[i].item_name && charity_name == donationItemsArr[i].charity_name) {
            return i; // Return index if item exists
        }
    }
    return -1; // Return -1 if item does not exist
}

// Function to initialize search functionality
function search() {
    var inputField = document.getElementById('searchInput');
    var rows = document.querySelectorAll("tbody tr"); // Get all table rows

    // Add event listener to input field
    inputField.addEventListener('keyup', function() {
        searchTable(rows, inputField.value.toLowerCase()); // Search table on keyup
    });
}

// Function to search each table row for the text in the search bar and show/hide the row accordingly
// Parameters: rows (node list of table rows), input (search input text)
function searchTable(rows, input) {
    rows.forEach(row => {
        console.log(row);
        var rowText = row.textContent.toLowerCase().replace('sendToCart', ''); // Get row text and remove button text

        console.log(rowText);
        
        if (rowText.includes(input)) {
            console.log('match');
            row.style.display = ''; // Show row if match found
        } else {
            row.style.display = 'none'; // Hide row if no match
            console.log('no match');
        }
    });
}
