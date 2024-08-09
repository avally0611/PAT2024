window.addEventListener('load', function () {
    console.log('All assets are loaded');
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

function populateDonationsTable(donations_needed){

    const tableBody = document.getElementById('tbody');

    donations_needed.forEach(dn => {

        const row = document.createElement('tr');

        //dont actually need this - just need it for a function
        // const donationID = document.createElement('td');
        // donationID.textContent = dn.donation_id;


        //we need to get the name of charity id from table
        const charityID = document.createElement('td');
        charityID.textContent = dn.charity_id;
        
        const quantity = document.createElement('td');
        quantity.textContent = dn.quantity;

        const itemName = document.createElement('td');
        itemName.textContent = dn.item_name;

        const button = document.createElement('button');
        button.textContent = 'Donate';

        //have to create a normal table data element as usual - also have to make a button (diff element)
        const buttonCell = document.createElement('td');
        buttonCell.appendChild(button);

        //when button clicked - do this...
        button.addEventListener('click', function() {
            donate(dn.donation_id);

        });

        //adding all the elements to the row(across)
        row.appendChild(charityID);
        row.appendChild(itemName);
        row.appendChild(quantity);
        row.appendChild(buttonCell);

        //add entire row to actual table
        tableBody.appendChild(row);
    });



    


    

}

//when user clicks on an entry to donate to - take them to confirmation page?
function donate(donationID)
{

    
}

