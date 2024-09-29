const donateButton = document.getElementById('donate-button');
donateButton.addEventListener('click', donateButtonClicked);

window.addEventListener('load', function () {
    console.log('All assets are loaded');
    fetchCharitiesforDropdown();

    
});

function fetchCharitiesforDropdown() {
    fetch('http://localhost:8383/api/charities')
        .then(response => response.json())
        .then(data => {
            createCharityDropdown(data);
            
        })
        .catch(error => {
            console.error('Error: Trying to get data from server', error);
        });

}

function createCharityDropdown(charities){

    