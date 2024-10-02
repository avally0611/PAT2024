//we need two functions here:
//1. control local storage for number of cart items
window.addEventListener('load', function(){

    const numItems = sessionStorage.getItem('numCartItems');

    const cartItemsSpan = document.getElementById('cart-num-items');

    if(numItems != null){
        cartItemsSpan.textContent = numItems;
        console.log(numItems);
    }
    else{
        cartItemsSpan.textContent = 0;
    }

    const dropdown = document.getElementById('navbarDropdown');
    const username = sessionStorage.getItem('username');
    const signinDropdown = document.getElementById('signinDropdown');

    if(username != null){
        dropdown.textContent = 'Welcome ' + username;
        signinDropdown.textContent = 'Sign Out';
        signinDropdown.href = 'index.html';
    }
    else{
        dropdown.textContent = 'Welcome Guest';
        signinDropdown.textContent = 'Sign In';
        signinDropdown.href = 'login.html';
    }

    signinDropdown.addEventListener('click', function(){
        if (signinDropdown.textContent === 'Sign Out')
        {
            if (confirm('Are you sure you want to sign out?'))
            {
                sessionStorage.clear();
            }

        }
        
    });

	


});

