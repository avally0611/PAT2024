let signupForm;
let signupButton;
let errorMessage;

// Add event listener to window load event
window.addEventListener('load', function() {
    initializeElements();
    setupEventListeners();
});

// This function will initialize the elements
function initializeElements() {
    // Get the signup form element by ID
    signupForm = document.getElementById("signupBox");
    // Get the signup button element by ID
    signupButton = document.getElementById("signupButton");
    // Get the error message element by ID
    errorMessage = document.getElementById("errorMessage");
}

// This function will setup the event listeners
function setupEventListeners() {
    // Add submit event listener to the signup form
    signupForm.addEventListener('submit', handleFormSubmit);
    // Get the password input element by ID
    const password = document.getElementById('pass');
    // Add keyup event listener to the password input
    password.addEventListener('keyup', handlePasswordKeyup);
    // Get the show password checkbox element by ID
    const checkbox = document.getElementById('showPassword');
    // Add change event listener to the checkbox
    checkbox.addEventListener('change', handleCheckboxChange);
}

// This function will handle the form submit event
// Parameters: event - the submit event
function handleFormSubmit(event) {
    // Check if the form is valid
    if (!signupForm.checkValidity()) {
        // Prevent form submission if invalid
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Prevent default form submission
    event.preventDefault();
    // Call addUser function to add the user
    addUser();
}

// This function will handle the keyup event for the password field
function handlePasswordKeyup() {
    // Get the password input element by ID
    const password = document.getElementById('pass');
    // Check the password strength
    checkPasswordStrength(password.value);
}

// This function will handle the change event for the checkbox
function handleCheckboxChange() {
    // Get the password input element by ID
    const password = document.getElementById('pass');
    // Get the show password checkbox element by ID
    const checkbox = document.getElementById('showPassword');
    // Toggle password visibility based on checkbox state
    if (checkbox.checked) {
        password.type = 'text';
    } else {
        password.type = 'password';
    }
}

// This function will check the password strength
// Parameters: password - the password string to check
function checkPasswordStrength(password) {
    let messages = [];

    // Check if password length is less than 8 characters
    if (password.length < 8) {
        messages.push("Password must be at least 8 characters long");
    }
    
    // Check if password contains both lowercase and uppercase letters
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        messages.push("Password must contain both lowercase and uppercase letters");
    }

    // Check if password contains at least one number
    if (!/[0-9]/.test(password)) {
        messages.push("Password must contain at least one number");
    }

    // Check if password contains at least one special character
    if (!/[!@#$%^&*]/.test(password)) {
        messages.push("Password must contain at least one special character");
    }

    // If there are any validation messages, display them
    if (messages.length > 0) {
        errorMessage.textContent = messages.join(". ");
        errorMessage.style.display = "block";
        signupButton.disabled = true;
    } else {
        errorMessage.style.display = "none";
        signupButton.disabled = false;
    }
}

// This function will add a user to the database
function addUser(){
    console.log('Button clicked');
    // Get user input values by ID
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var pnum = document.getElementById('pnum').value;
    console.log(JSON.stringify({ username, password, fname, lname, email, pnum}));

    // Send a POST request to add the user
    fetch("http://localhost:8383/api/addUser", 
    {
        method: "POST",
        body: JSON.stringify({ username, password, fname, lname, email, pnum }),
        headers: 
        {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    // Check the response from the server
    .then(response => response.text()).then(data => 
    {
        // If the response is 'Successful'
        if (data === 'Successful')
        {
            errorMessage.textContent = "Unique username";
            console.log('Signup successful');
            alert("Signup successful");
            // Redirect to login page
            window.location.href = "login.html";
        }
        // If the response is 'Username already exists'
        else if (data === 'Username already exists')
        {
            console.log('Username already exists');
            errorMessage.textContent = "Username already exists"; 
            errorMessage.style.display = "block";
        }
        // If the signup failed
        else
        {
            console.log('Signup failed');
            alert("Signup failed");
        }
    });
}
