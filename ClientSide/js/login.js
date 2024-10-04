document.addEventListener('DOMContentLoaded', function() 
{
    // Get the login button element by its ID
    const loginButt = document.getElementById('loginButt');

    // Add click event listener to the login button
    loginButt.addEventListener('click', function(event) {
        event.preventDefault();    // Prevent the default form submission
        verifyData();              // Call the verifyData function
    });

    // Add change event listener to the show password checkbox
    document.getElementById('showPassword').addEventListener('change', function() {
        // Get the password input element by its ID
        const password = document.getElementById('pass');
        if (this.checked) {
            password.type = 'text';    // Show password as text
        } else {
            password.type = 'password'; // Hide password
        }
    });
});

// Function to verify login data
function verifyData() {
    console.log('Button clicked'); // Log button click
    // Get username and password values from input fields
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass').value;
    console.log(JSON.stringify({ username, password })); // Log the username and password

    // Send a POST request to the server to verify login
    fetch("http://localhost:8383/api/verifyLogin", 
    {
        method: "POST", // HTTP method
        body: JSON.stringify({ username, password }), // Request body

        headers: 
        {
            "Content-type": "application/json; charset=UTF-8" // Request headers
        }
    })
    // Handle the response from the server
    .then(response => response.text()).then(data => 
    {
        console.log(data); // Log the response data
        if (data == 'true')
        {
            console.log('Login successful'); // Log successful login
            sessionStorage.setItem('username', username); // Store username in session storage
            alert("Login successful"); // Show success alert
            window.location.href = "index.html"; // Redirect to index.html
        }
        else
        {
            // Display error message for failed login
            errorMessage.textContent = "Login failed. Incorrect username or password."; 
            errorMessage.style.display = "block"; // Show the error message
        }
    });
}
