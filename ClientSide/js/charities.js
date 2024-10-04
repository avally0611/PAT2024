window.addEventListener('load', function () {
    console.log('All assets are loaded');
    fetchCharities();
});

function fetchCharities() {
    fetch('http://localhost:8383/api/charities')
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
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
        image.src = charity.logo;
        image.className = 'card-image';

        const name = document.createElement('h3');
        name.textContent = charity.name;
        name.className = 'card-title';

        const description = document.createElement('p');
        description.textContent = charity.description;
        name.className = 'card-description';

        const npo = document.createElement('p');
        npo.textContent = 'NPO: ' + charity.NPO;
        name.className = 'card-npo';

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(npo);

        container.appendChild(card);

        
    });
    

}

