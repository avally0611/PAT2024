document.addEventListener('DOMContentLoaded', function() 
{
    const loginButt = document.getElementById('loginButt');

    loginButt.addEventListener('click', function(event) {
        event.preventDefault();    
        verifyData();
    });

    document.getElementById('showPassword').addEventListener('change', function() {
        const password = document.getElementById('pass');
        if (this.checked) {
            password.type = 'text';
        } else {
            password.type = 'password';
        }
    });


}
);

//remember fetch method cannot be done in addEventListener
function verifyData() {
    console.log('Button clicked');
    var username = document.getElementById('username').value;
    var password = document.getElementById('pass').value;
    console.log(JSON.stringify({ username, password }));


    fetch("http://localhost:8383/api/verifyLogin", 
    {

    method: "POST",
    body: JSON.stringify({ username, password }),

    headers: 
    {
        "Content-type": "application/json; charset=UTF-8"
    }

    })
    
    //basically checks if theres a response, if there is convert to text and then check what text says
    .then(response => response.text()).then(data => 
    {
        console.log(data);
        if (data == 'true')
        {
            console.log('Login successful');
            sessionStorage.setItem('username', username);
            alert("Login successful");
            window.location.href = "index.html";
            
        }
        else
        {
            errorMessage.textContent = "Login failed. Incorrect username or password."; // Display error message
            errorMessage.style.display = "block"; // Show the error message
        }

  
});
  
    
}


