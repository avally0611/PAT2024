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
            //we need to pass how many items needed because we will use it in the cart.html for the max value of slider
            donate(dn.item_name, dn.quantity);

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

//when user clicks on an entry to donate to - increase cart number
function donate(item_name, donation_quantity) 
{
   //get num items already by getting span elemtn and 
    const numItems = parseInt(document.getElementById('cart-num-items').textContent);

    //set span element to new number of items
    sessionStorage.setItem('numCartItems', numItems + 1);

    //we have to do this as cart will only update when page is refreshed
    document.getElementById('cart-num-items').textContent = numItems + 1;


    //add donation to cart
    addDonationToCartSessionStorage(item_name, donation_quantity);
    

    
}

function addDonationToCartSessionStorage(item_name, donation_quantity)
{
    //so essentially we get the cartItems array from local storage
    //if there is no array - we make one
    //we then add the dpnation id to the array
    //we then add the array to local storage under the field 'cartItems'

    //this is for name of the cartItems
    var cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
    
    //this is for the id of the cartItems
    var cartItemsQuantity = JSON.parse(sessionStorage.getItem('cartItemsQuantity'));
    
    if (cartItems == null)
    {
        cartItems = [];
    }

    if (cartItemsQuantity == null)
    {
        cartItemsQuantity = [];
    }

    //for JS array - we just need to yse .push method to add to array 
    cartItems.push(item_name);

    //we have to add the id of the donation to the cartItemsID array
    cartItemsQuantity.push(donation_quantity);

    sessionStorage.setItem('cartItems', JSON.stringify(cartItems));
    sessionStorage.setItem('cartItemsQuantity', JSON.stringify(cartItemsQuantity));

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
        
        //when you get the text content - it includes the button text - since we know it is donate - we can just remove it by using .replace
        var rowText = row.textContent.toLowerCase().replace('donate', '');

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

