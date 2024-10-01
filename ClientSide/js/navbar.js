//we need two functions here:
//1. control local storage for number of cart items
window.addEventListener('DOMContentLoaded', function(){

    const numItems = sessionStorage.getItem('numCartItems');

    const cartItemsSpan = document.getElementById('cart-num-items');

    if(numItems != null){
        cartItemsSpan.textContent = numItems;
        console.log(numItems);
    }
    else{
        cartItemsSpan.textContent = 0;
    }


	


});