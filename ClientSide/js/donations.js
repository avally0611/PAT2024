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

    search();


}

//when user clicks on an entry to donate to - take them to confirmation page?
function donate(donationID)
{

    
}

//this will be the search function: 
function search(){

    var inputField = document.getElementById('searchInput');
    
    //we have to do this because we just want the rows specifically - we want a list of all rows not just the tbody element
    //also - it gets the rows as a node list which just has a list of html elements
    var rows = document.querySelectorAll("#tbody tr");


    //every time a letter is typed, the searching algorithm will be called)
    inputField.addEventListener('keyup', function() {
        searchTable(rows, inputField.value.toLowerCase());
    });

}

function searchTable(rows, input){

    //do a foreach to check each row for text in search bar
    rows.forEach(row => {
        console.log(row);

        
        var rowText = row.textContent.toLowerCase();
        console.log(rowText);

        
        if (rowText.includes(input))
        {
            console.log('match');
            //when you use .style - you can modify element's css - in this case, we are making it visible (using css property of display)
            row.style.display = '';
        }
        else
        {
            row.style.display = 'none';
            console.log('no match');
        }
    });
}
