// Initialize an empty array to store cart items
var cartItemsArr = [];
window.addEventListener('load', function(){

    // Retrieve cart items from session storage as an array
    cartItemsArr = JSON.parse(sessionStorage.getItem('donationItemsArr'));
    console.log(cartItemsArr);
    // Iterate over each cart item and create a cart item element
    cartItemsArr.forEach(createCartItem);

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', function() {
        console.log(cartItemsArr);
        // Confirm checkout action
        if (confirm('Are you sure you want to checkout?')) {
            confirmDonation();
        }
    });

});

// Method to create a cart item consisting of the name, number of items, and a remove button - then added to div element
// Parameters: cartItemRow - object containing details of the cart item
function createCartItem(cartItemRow)
{
    console.log(cartItemRow);
    const cartContainer = document.getElementById('cart-items-list');

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const cartItemName = document.createElement('span');
    cartItemName.textContent = cartItemRow.charity_name + ': ' + cartItemRow.item_name;
    cartItemName.classList.add('cart-item-name');

    // Create an input element which has a max and min which allows user to change quantity of items donated
    const numCartItem = document.createElement('input');
    numCartItem.classList.add('cart-item-quantity-input');
    numCartItem.type = 'number';
    numCartItem.min = 1;
    numCartItem.max = cartItemRow.donation_quantity_needed;
    numCartItem.value = cartItemRow.donation_quantity;
    numCartItem.addEventListener('change', function() {
        console.log(cartItemRow.request_id);
        changeNumItems(cartItemRow.request_id, numCartItem);
    });

    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.classList.add('remove-button');

    // Append elements to the cart item
    cartItem.appendChild(cartItemName);
    cartItem.appendChild(numCartItem);
    cartItem.appendChild(removeButton);

    // Append cart item to the cart container
    cartContainer.appendChild(cartItem);

    // Add event listener to remove button
    removeButton.addEventListener('click', function() {
        removeCartItem(cartItemRow.request_id, cartItem, numCartItem);
    });
}

// Method to change the number of items in the cart
// Parameters: request_id - ID of the request, cartItemInput - input element for the cart item quantity
function changeNumItems(request_id, cartItemInput)
{
    // Get items in cart logo
    const numItems = parseInt(document.getElementById('cart-num-items').textContent);

    // Get original number of items when item was added to cart
    const numItemsOriginally = parseInt(cartItemsArr[findIndexInArr(request_id)].donation_quantity);

    // Update the number of items in the cart
    if (parseInt(cartItemInput.value) > numItemsOriginally)
    {
        sessionStorage.setItem('numCartItems', numItems + (parseInt(cartItemInput.value) - numItemsOriginally));
        document.getElementById('cart-num-items').textContent = numItems + (parseInt(cartItemInput.value) - numItemsOriginally);
    }
    else
    {
        sessionStorage.setItem('numCartItems', numItems - (numItemsOriginally - parseInt(cartItemInput.value)));
        document.getElementById('cart-num-items').textContent = numItems - (numItemsOriginally - parseInt(cartItemInput.value));
    }

    // Update the cart item quantity in the array and session storage
    cartItemsArr[findIndexInArr(request_id)].donation_quantity = cartItemInput.value;
    console.log(cartItemsArr);
    sessionStorage.setItem('donationItemsArr', JSON.stringify(cartItemsArr));
}

// Method to remove a cart item
// Parameters: request_id - ID of the request, cartItem - cart item element, cartItemInput - input element for the cart item quantity
function removeCartItem(request_id, cartItem, cartItemInput)
{
    // Remove item from array and session storage
    cartItemsArr.splice(findIndexInArr(request_id), 1);
    sessionStorage.setItem('donationItemsArr', JSON.stringify(cartItemsArr));
    const cartContainer = document.getElementById('cart-items-list');
    cartContainer.removeChild(cartItem);

    // Update number of items in cart icon
    const numItems = parseInt(document.getElementById('cart-num-items').textContent);
    sessionStorage.setItem('numCartItems', numItems - parseInt(cartItemInput.value));
    document.getElementById('cart-num-items').textContent = numItems - parseInt(cartItemInput.value);
}

// Method to find the position of an item in the array using request ID
// Parameters: request_id - ID of the request
// Returns: Index of the item in the array, or -1 if not found
function findIndexInArr(request_id)
{
    for (let i = 0; i < cartItemsArr.length; i++)
    {
        if (cartItemsArr[i].request_id == request_id)
        {
            return i;
        }
    }
    return -1;
}

// Method to confirm donation
// Once user clicks checkout - we need to send the data to the server, clear session storage, and redirect to confirmation page
function confirmDonation()
{
    console.log('confirm donation');
    cartItemsArr.forEach(cartItem => {
        // Collect data - items donated - send to server to send to MySQL table
        console.log(cartItem);
        fetch('http://localhost:8383/api/addDonation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: sessionStorage.getItem('username'), cartItem: cartItem }),
        })
        .then(response => response.text()).then(data => 
            {
                console.log(data);
                if (data == 'true')
                {
                    console.log('donation successful');
                    // Clear session storage
                    sessionStorage.removeItem('donationItemsArr');
                    sessionStorage.removeItem('numCartItems');

                    // Redirect to confirmation page
                    window.location.href = 'confirmationDonation.html';
                }
                else
                {
                    console.log('donation failed');
                }
            });    
    });
}
