let signupButton;
let errorMessage;

window.addEventListener('load', function() {

    signupButton = document.getElementById("signupButton");

    signupButton.addEventListener('click', function(event) {
        event.preventDefault();
        addUser();
    });

    const username = document.getElementById('username');
    const password = document.getElementById('pass');
    errorMessage = document.getElementById("errorMessage");

    pass.addEventListener('keyup', function() {

        checkPasswordStrength(password.value);

    });

});

function checkPasswordStrength(password) {

    const strength = {
        1: 'Very Weak',
        2: 'Weak',
        3: 'Medium',
        4: 'Strong',
        5: 'Very Strong'
    };

    let strengthValue = 1;

    if (password.length > 5) strengthValue++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strengthValue++;
    if (password.match(/[0-9]/)) strengthValue++;
    if (password.match(/[$@#&!]/)) strengthValue++;
    if (password.length > 12) strengthValue++;

    document.getElementById("errorMessage").innerHTML = strength[strengthValue];
}

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
        }

  
    });
  
}

