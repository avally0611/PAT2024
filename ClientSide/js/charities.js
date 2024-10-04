// Add an event listener to the window object that triggers when the page is fully loaded
window.addEventListener('load', function () {
    console.log('All assets are loaded');
    fetchCharities(); // Call the fetchCharities function
});

// Function to fetch charity data from the server
function fetchCharities() {
    // Make a GET request to the specified URL
    fetch('http://localhost:8383/api/charities')
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            console.log('Success:', data);
            createCharityCards(data); // Call the createCharityCards function with the fetched data
        })
        .catch(error => {
            console.error('Error: Trying to get data from server', error);
        });
}

// Function to create charity cards and append them to the DOM
function createCharityCards(charities) {
    const container = document.getElementById('cards-container'); // Get the container element

    // Iterate over each charity object in the charities array
    charities.forEach(charity => {
        const card = document.createElement('div'); // Create a new div element for the card
        card.className = 'card'; // Set the class name for the card

        const image = document.createElement('img'); // Create an img element for the charity logo
        image.src = charity.logo; // Set the source of the image
        image.className = 'card-image'; // Set the class name for the image

        const name = document.createElement('h3'); // Create an h3 element for the charity name
        name.textContent = charity.name; // Set the text content of the h3 element
        name.className = 'card-title'; // Set the class name for the h3 element

        const description = document.createElement('p'); // Create a p element for the charity description
        description.textContent = charity.description; // Set the text content of the p element
        name.className = 'card-description'; // Set the class name for the p element

        const npo = document.createElement('p'); // Create a p element for the NPO number
        npo.textContent = 'NPO: ' + charity.NPO; // Set the text content of the p element
        name.className = 'card-npo'; // Set the class name for the p element

        // Append the created elements to the card div
        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(npo);

        // Append the card div to the container element
        container.appendChild(card);
    });
}
