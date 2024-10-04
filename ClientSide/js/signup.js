let signupForm;
let signupButton;
let errorMessage;

window.addEventListener('load', function() {
    initializeElements();
    setupEventListeners();
});

//this function will initialize the elements
function initializeElements() {
    signupForm = document.getElementById("signupBox");
    signupButton = document.getElementById("signupButton"); // Initialize signupButton
    errorMessage = document.getElementById("errorMessage");
}

//this function will setup the event listeners
function setupEventListeners() {
    signupForm.addEventListener('submit', handleFormSubmit);
    const password = document.getElementById('pass');
    password.addEventListener('keyup', handlePasswordKeyup);
    const checkbox = document.getElementById('showPassword');
    checkbox.addEventListener('change', handleCheckboxChange);
}

//this function will handle the form submit event
function handleFormSubmit(event) {
    if (!signupForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    event.preventDefault();
    addUser();
}

//this function will handle the keyup event for the password field
function handlePasswordKeyup() {
    const password = document.getElementById('pass');
    checkPasswordStrength(password.value);
}

//this function will handle the change event for the checkbox
function handleCheckboxChange() {
    const password = document.getElementById('pass');
    const checkbox = document.getElementById('showPassword');
    if (checkbox.checked) {
        password.type = 'text';
    } else {
        password.type = 'password';
    }
}

//this function will check the password strength
function checkPasswordStrength(password) {
    let messages = [];

    if (password.length < 8) {
        messages.push("Password must be at least 8 characters long");
    }
    
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        messages.push("Password must contain both lowercase and uppercase letters");
    }

    if (!/[0-9]/.test(password)) {
        messages.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*]/.test(password)) {
        messages.push("Password must contain at least one special character");
    }

    if (messages.length > 0) {
        errorMessage.textContent = messages.join(". ");
        errorMessage.style.display = "block";
        signupButton.disabled = true;
    } else {
        errorMessage.style.display = "none";
        signupButton.disabled = false;
    }
}

//this function will add a user to database
function addUser(){
    console.log('Button clicked');
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass').value;
    var fname = document.getElementById('fname').value;
    var lname = document.getElementById('lname').value;
    var email = document.getElementById('email').value;
    var pnum = document.getElementById('pnum').value;
    console.log(JSON.stringify({ username, password, fname, lname, email, pnum}));


    fetch("http://localhost:8383/api/addUser", 
    {

    method: "POST",
    body: JSON.stringify({ username, password, fname, lname, email, pnum }),

    headers: 
    {
        "Content-type": "application/json; charset=UTF-8"
    }

    })
    
    //basically checks if theres a response, if there is convert to text and then check what text says
    .then(response => response.text()).then(data => 
    {
        if (data === 'Successful')
        {
            errorMessage.textContent = "Unique username";
            console.log('Signup successful');
            alert("Signup successful");
            window.location.href = "login.html";
            
        }
        else if (data === 'Username already exists')
        {
            console.log('Username already exists');
            errorMessage.textContent = "Username already exists"; 
            errorMessage.style.display = "block";
        }
        else
        {
            console.log('Signup failed');
            alert("Signup failed");
        }

  
    });
  
}

