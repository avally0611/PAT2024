window.addEventListener('load', function () {
    console.log('All assets are loaded');
    fetchCharities();
});

function fetchCharities() {
    fetch('http://localhost:8383/api/charities')
        .then(response => response.json())
        .then(data => {
            createCharityCards(data);
            
        })
        .catch(error => {
            console.error('Error: Tryning to get data from server', error);
        });

}

function createCharityCards(charities){

    const container = document.getElementById('cards-container');

    charities.forEach(charity => {
        const card = document.createElement('div');
        card.className = 'card';

        const image = document.createElement('img');
        image.src = ("https://www.econlib.org/wp-content/uploads/2018/02/Charity-scaled.jpeg");
        image.className = 'card-image';

        const name = document.createElement('h3');
        name.textContent = charity.name;
        name.className = 'card-title';

        const description = document.createElement('p');
        description.textContent = charity.description;
        name.className = 'card-description';

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(description);

        container.appendChild(card);

        
    });
    

}

