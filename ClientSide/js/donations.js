window.addEventListener('load', function () {
    fetchDonations();
});

function fetchDonations() {
    fetch('http://localhost:8383/api/donations')
        .then(response => response.json())
        .then(data => {
            populateDonationsTable(data);
            
        })
        .catch(error => {
            console.error('Error: Tryning to get data from server', error);
        });

}

function populateDonationsTable(charities){

    const tableBody = document.getElementById('tbody');

    

    


    

}

