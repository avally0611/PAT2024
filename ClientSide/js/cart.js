window.addEventListener('load', function(){

    const cartItems = JSON.parse(sessionStorage.getItem('cartItems'));
    console.log(cartItems);

    cartItems.forEach(createCartItem);

});


//method is used to create a cart item consisting of the name, number of items and a remove button - then added to div element
function createCartItem(item_name)
{
    const cartContainer = document.getElementById('cart-items-list');

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const cartItemName = document.createElement('span');
    cartItemName.textContent = item_name;
    cartItemName.classList.add('cart-item-name');

    //so here: we need to creae some sort of spinner that allows user to add more of the same item
    //we also need to see if there has been a repeat of an item to showing the accurate quantity
    const numCartItem = document.createElement('span');
    numCartItem.textContent = 1;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';

    removeButton.addEventListener('click', function(){
        removeCartItem(item_name);
    });

    cartItem.appendChild(cartItemName);
    cartItem.appendChild(numCartItem);
    cartItem.appendChild(removeButton);

    cartContainer.appendChild(cartItem);

  
}