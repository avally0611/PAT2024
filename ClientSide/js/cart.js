var cartItemsArr = [];
window.addEventListener('load', function(){

    //retrieved as array
    cartItemsArr = JSON.parse(sessionStorage.getItem('donationItemsArr'));
    console.log(cartItemsArr);
    cartItemsArr.forEach(createCartItem);

    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click', function() {
        confirm('Are you sure you want to checkout?');
        confirmDonation();
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
    cartItemName.textContent = cartItemRow.item_name;
    cartItemName.classList.add('cart-item-name');

    //so here: we create an input element which has a max and min which allows user to change quantity of items donated
    const numCartItem = document.createElement('input');
    numCartItem.classList.add('cart-item-quantity-input');
    numCartItem.type = 'number';
    numCartItem.min = 1;
    numCartItem.max = cartItemRow.donation_quantity_needed;
    numCartItem.value = cartItemRow.donation_quantity;
    numCartItem.addEventListener('change', changeNumItems);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.classList.add('remove-button');

    
    
    cartItem.appendChild(cartItemName);
    cartItem.appendChild(numCartItem);
    cartItem.appendChild(removeButton);

    cartContainer.appendChild(cartItem);

    removeButton.addEventListener('click', function() {
        removeCartItem(cartItemRow.donation_id, cartItem);
    });

  
}

function changeNumItems()
{


}

//need to pass the cart item so we can remove that specific child from parent element (container)
function removeCartItem(item_id, cartItem)
{
    //remove from storage and on card
    cartItemsArr.splice(findIndexInArr(item_id), 1);
    sessionStorage.setItem('donationItemsArr', JSON.stringify(cartItemsArr));
    
    const cartContainer = document.getElementById('cart-items-list');
    cartContainer.removeChild(cartItem);
    

}

function findIndexInArr(item_id)
{
    for (let i = 0; i < cartItemsArr.length; i++)
    {
        if (cartItemsArr[i].donation_id == item_id)
        {
            return i;
        }
    }
    return -1;

}

//once user clicks checkout - we need to send the data to the server, we need to clear session storage and redirect to confirmation page
function confirmDonation()
{
    //collect data - items donated - send to server to send to mysql table
    console.log(cartItemsArr);
    
    
    //clear session storage
    sessionStorage.removeItem('donationItemsArr');
    sessionStorage.removeItem('numCartItems');

    window.location.href = 'confirmationDonation.html';

}