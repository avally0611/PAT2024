window.addEventListener('load', function() {
    updateCartItems();
    updateUserDropdown();
    setupSignOutListener();
});

// Function to update the number of items in the cart on the navbar
function updateCartItems() {
    const numItems = sessionStorage.getItem('numCartItems');
    const cartItemsSpan = document.getElementById('cart-num-items');

    if (numItems != null) {
        cartItemsSpan.textContent = numItems;
        console.log(numItems);
    } else {
        cartItemsSpan.textContent = 0;
    }
}

// Function to update the user dropdown on the navbar
function updateUserDropdown() {
    const dropdown = document.getElementById('navbarDropdown');
    const username = sessionStorage.getItem('username');
    const signinDropdown = document.getElementById('signinDropdown');
    const profileDropdown = document.getElementById('profileDropdown');

    if (username != null) {
        dropdown.textContent = 'Welcome ' + username;
        signinDropdown.textContent = 'Sign Out';
        signinDropdown.href = 'index.html';
    } else {
        dropdown.textContent = 'Welcome Guest';
        profileDropdown.style.display = 'none';
        signinDropdown.textContent = 'Sign In or Register';
        signinDropdown.href = 'login.html';
    }
}

// Function to setup the sign out listener on the navbar
function setupSignOutListener() {
    const signinDropdown = document.getElementById('signinDropdown');

    signinDropdown.addEventListener('click', function() {
        if (signinDropdown.textContent === 'Sign Out') {
            if (confirm('Are you sure you want to sign out?')) {
                sessionStorage.clear();
            }
        }
    });
}
