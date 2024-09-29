window.addEventListener('load', function(){

    //retrieved as array
    const cartItemsQuantity = JSON.parse(sessionStorage.getItem('cartItemsQuantity'));
    const cartItems = JSON.parse(sessionStorage.getItem('cartItems'));

    
    (checkForDuplicates(cartItems, cartItemsQuantity)).forEach(createCartItem);

});

//use this to check for duplicates in the cart array nd create a new 3d array with the item name and quantity
function checkForDuplicates(cartItems, cartItemsQuantity)
{
    if (cartItems == null)
    {
        return cartItems;
    }
    else
    {
        //create a 3d array to store the item name and quantity
        var cartItems3DArr = [];

        var duplicate = false;
        for (var i = 0; i < cartItems.length - 1; i++)
        {
            //if the item is the same as the next item - then 
            while (cartItems[i] == cartItems[i + 1])
            {
                cartItems3DArr.push([cartItems[i], 2, cartItemsQuantity[i]]);
                i++;
                duplicate = true;
            }

            if (duplicate == false)
            {
                cartItems3DArr.push([cartItems[i], 1, cartItemsQuantity[i]]);
            }
            else
            {
                break;
            }
            
        }

        console.log(cartItems3DArr);
        return cartItems3DArr;

    }
}


//method is used to create a cart item consisting of the name, number of items and a remove button - then added to div element
function createCartItem(cartItemRow)
{
    console.log(cartItemRow);
    const cartContainer = document.getElementById('cart-items-list');

    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const cartItemName = document.createElement('span');
    cartItemName.textContent = cartItemRow[0];
    cartItemName.classList.add('cart-item-name');

    //so here: we need to create some sort of spinner that allows user to add more of the same item
    //we also need to see if there has been a repeat of an item to showing the accurate quantity
    const numCartItem = document.createElement('input');
    numCartItem.classList.add('cart-item-quantity-input');
    numCartItem.type = 'number';
    numCartItem.min = 1;

    numCartItem.max = cartItemRow[2];

    numCartItem.value = cartItemRow[1];
    numCartItem.addEventListener('change', changeNumItems);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.classList.add('remove-button');

    removeButton.addEventListener('click', removeCartItem(cartItemRow[0]));
    
    cartItem.appendChild(cartItemName);
    cartItem.appendChild(numCartItem);
    cartItem.appendChild(removeButton);

    cartContainer.appendChild(cartItem);

  
}

function changeNumItems()
{

}

function removeCartItem(item_name)
{

}
