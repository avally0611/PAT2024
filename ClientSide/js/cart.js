var cartItemsArr = [];
window.addEventListener('load', function(){

    //retrieved as array
    cartItemsArr = JSON.parse(sessionStorage.getItem('donationItemsArr'));
    console.log(cartItemsArr);
    cartItemsArr.forEach(createCartItem);

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', function() {
        console.log(cartItemsArr);
        if (confirm('Are you sure you want to checkout?')) {
            confirmDonation();
        }
 
    });

});

//method is used to create a cart item consisting of the name, number of items and a remove button - then added to div element
function createCartItem(cartItemRow)
{
    console.log(cartItemRow);
    const cartContainer = document.getElementById('cart-items-list');

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const cartItemName = document.createElement('span');
    cartItemName.textContent = cartItemRow.charity_name + ': ' + cartItemRow.item_name;
    cartItemName.classList.add('cart-item-name');

    //so here: we create an input element which has a max and min which allows user to change quantity of items donated
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

    
    
    cartItem.appendChild(cartItemName);
    cartItem.appendChild(numCartItem);
    cartItem.appendChild(removeButton);

    cartContainer.appendChild(cartItem);

    removeButton.addEventListener('click', function() {
        removeCartItem(cartItemRow.request_id, cartItem, numCartItem);
    });

  
}

function changeNumItems(request_id, cartItemInput)
{

    //get items in cart logo
    const numItems = parseInt(document.getElementById('cart-num-items').textContent);

    //get original number of items when item was added to cart
    const numItemsOriginally = parseInt(cartItemsArr[findIndexInArr(request_id)].donation_quantity );

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
    

    cartItemsArr[findIndexInArr(request_id)].donation_quantity = cartItemInput.value;
    console.log(cartItemsArr);
    sessionStorage.setItem('donationItemsArr', JSON.stringify(cartItemsArr));

}

//need to pass the cart item so we can remove that specific child from parent element (container)
function removeCartItem(request_id, cartItem, cartItemInput)
{
    //remove from storage and on card
    cartItemsArr.splice(findIndexInArr(request_id), 1);
    sessionStorage.setItem('donationItemsArr', JSON.stringify(cartItemsArr));
    const cartContainer = document.getElementById('cart-items-list');
    cartContainer.removeChild(cartItem);

    //update number of items in cart icon
    const numItems = parseInt(document.getElementById('cart-num-items').textContent);
    sessionStorage.setItem('numCartItems', numItems - parseInt(cartItemInput.value));
    document.getElementById('cart-num-items').textContent = numItems - parseInt(cartItemInput.value);
    

}

//find position of item in array using request id
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

//once user clicks checkout - we need to send the data to the server, we need to clear session storage and redirect to confirmation page
function confirmDonation()
{
    console.log('confirm donation');
    cartItemsArr.forEach(cartItem => {

        //collect data - items donated - send to server to send to mysql table
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
                    //clear session storage
                    sessionStorage.removeItem('donationItemsArr');
                    sessionStorage.removeItem('numCartItems');

                    window.location.href = 'confirmationDonation.html';
                    
                }
                else
                {
                    console.log('donation failed');
                }
        
          
            });    
    });
}
    
