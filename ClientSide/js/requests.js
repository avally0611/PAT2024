const donationItemsArr = [];

window.addEventListener('load', function () {
    console.log('All assets are loaded');
    fetchRequests();
});

function fetchRequests() {
    fetch('http://localhost:8383/api/requests')
        .then(response => response.json())
        .then(data => {
            createRequestTables(data);
            
        })
        .catch(error => {
            console.error('Error: Tryning to get data from server', error);
        });

}

function createRequestTables(donations_needed){

    const container = document.getElementById('requests-container');


    donations_needed.forEach(dn => {
        console.log(dn);    
        //THIS CREATES AN ENTIRE NEW TABLE FOR EACH CHARITY
        const tableHeading = document.createElement('h2');
        tableHeading.textContent = dn.name;
        tableHeading.classList.add('table-text');

        //this just creates the table settings or header - basically look at how bootstrap does it and create manually 
        const table = document.createElement('table');
        //bootstrap classes
        table.classList.add('table', 'table-scrollable', 'table-hover', 'table-bordered');

        const thead = document.createElement('thead');
        const rowHeader = document.createElement('tr');
        const headers = ['Item Name', 'Quantity Needed', 'Donate'];

        //in one row - add all headers which have scope of column
        headers.forEach(header => {
            const th = document.createElement('th');
            th.scope = 'col';
            th.textContent = header;
            rowHeader.appendChild(th);
        });

        thead.appendChild(rowHeader);
        table.appendChild(thead);

        //now we actually have to create/add body of table

        const tableBody = document.createElement('tbody');
        tableBody.classList.add('table-body');

        dn.requests.forEach(request => {
            const rowBody = document.createElement('tr');
            rowBody.classList.add('table-row');

            //for every request - we have to create a new row (with itemname + qty + button)
            const itemName = document.createElement('td');
            itemName.textContent = request.item_name;

            const quantity = document.createElement('td');
            quantity.textContent = request.quantity;
            
            const button = document.createElement('button');
            button.textContent = 'Send to cart';
            button.classList.add('tableButton');

            //have to create a normal table data element as usual - also have to make a button (diff element)
            const buttonCell = document.createElement('td');
            buttonCell.appendChild(button);

            //we have to create a quantity changer - this is an input element
            const quantityChanger = document.createElement('input');
            quantityChanger.classList.add('quantity-input');
            quantityChanger.id = 'quantityInput';
            quantityChanger.type = 'number';
            quantityChanger.min = 1;
            quantityChanger.max = request.quantity;
            quantityChanger.value = 1;
            quantityChanger.addEventListener('change', changeQuantity);

            //if user types in a number greater than the max - it will automatically set to max (we still wanna let user enter because it is strenous to keep clicking)
            quantityChanger.addEventListener('keyup', function() {
                checkQuantity(quantityChanger.max);
                if (quantityChanger.value === '')
                {
                    quantityChanger.value = 1;
                }
        
            });
        

            //when button clicked - do this...
            button.addEventListener('click', function() {
                //we need to pass how many items needed because we will use it in the cart.html for the max value of slider
                sendToCart(request.item_name, request.quantity, request.request_id);

            });

            //adding all the elements to the row(across)
            rowBody.appendChild(itemName);
            rowBody.appendChild(quantity);
            rowBody.appendChild(quantityChanger);
            rowBody.appendChild(buttonCell);

    
            //add entire row to actual table
            tableBody.appendChild(rowBody);

            });



        
        table.appendChild(tableBody);
        container.appendChild(tableHeading);
        container.appendChild(table);
        
        

    
    });

    search();


}

function changeQuantity()
{
    console.log('Quantity changed');
}

function checkQuantity(max)
{
    console.log('Checking quantity');
    var quantity = parseInt(document.getElementById('quantityInput').value);
    console.log(quantity,max);

    if (quantity > max)
    {
        document.getElementById('quantityInput').value = max;
    }
    
}


//when user clicks on sendToCart buttton - saves the data of item to JSON object and sends to cart.html
function sendToCart(item_name, donation_quantity_needed, request_id){

    //THIS IS FOR VISUAL PURPOSES - INCREASES NUMBER ON CART ICON
    //get num items already by getting span elemtn and 
    const numItems = parseInt(document.getElementById('cart-num-items').textContent);

    //set span element to new number of items
    sessionStorage.setItem('numCartItems', numItems + 1);

    //we have to do this as cart will only update when page is refreshed
    document.getElementById('cart-num-items').textContent = numItems + 1;

    
    //THIS IS FOR CODE PURPOSE - SENDS ITEM AS JSON OBJECT TO DISPLAY IN CART.HTML
    //we need to create a JSON object to send to cart.html
    const donationItem = {
        item_name: item_name,
        donation_quantity_needed: donation_quantity_needed,
        donation_id: request_id,
        donation_quantity: 1
    };

    var donationItemsArr = JSON.parse(sessionStorage.getItem('donationItemsArr'));

    if (donationItemsArr == null)
    {
        donationItemsArr = [];
    }

    if (itemExistsInArr(item_name, donationItemsArr))
    {
        //we need to find the item in the array and increase the quantity
        for (var i = 0; i < donationItemsArr.length; i++)
        {
            if (item_name == donationItemsArr[i].item_name)
            {
                donationItemsArr[i].donation_quantity ++;
            }
        }

    }
    else
    {
        donationItemsArr.push(donationItem);
    }
    

    sessionStorage.setItem('donationItemsArr', JSON.stringify(donationItemsArr));
  

}

function itemExistsInArr(item_name, donationItemsArr)
{
    for (var i = 0; i < donationItemsArr.length; i++)
    {
        if (item_name == donationItemsArr[i].item_name)
        {
            return true;
        }
    }

    return false;

}
//this will be the search function: 
function search(){

    var inputField = document.getElementById('searchInput');
    
    //we have to do this because we just want the rows specifically - we want a list of all rows not just the tbody element
    //also - it gets the rows as a node list which just has a list of html elements
    var rows = document.querySelectorAll("tbody tr");

    //every time a letter is typed, the searching algorithm will be called)
    inputField.addEventListener('keyup', function() {
        searchTable(rows, inputField.value.toLowerCase());
    });

}

function searchTable(rows, input){

    //do a foreach to check each row for text in search bar
    rows.forEach(row => {
        console.log(row);
        
        //when you get the text content - it includes the button text - since we know it is sendToCart - we can just remove it by using .replace
        var rowText = row.textContent.toLowerCase().replace('sendToCart', '');

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

