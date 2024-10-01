const loginButt = document.getElementById('loginButt');

loginButt.addEventListener('click', verifyData);

const signupButt = document.getElementById('signupButt');

signupButt.addEventListener('click', register);


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
            
        }
        else
        {
            console.log('Login failed');
        }

  
});
  
    
}

function register(){

    //load signup html page
    window.location.href = "signup.html";
    


}


