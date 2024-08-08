//ADD A POP UP FOR SUCCESSFUL SIGNUP

const signupButton = document.getElementById("signupButt");

signupButton.addEventListener('click', addUser);

const loginButt = document.getElementById("loginButt");

loginButt.addEventListener('click', signin)

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
        console.log(data);
        if (data == 'true')
        {
            console.log('Signup successful');
            
        }
        else
        {
            console.log('Signup failed');
        }

  
});
  
}

function signin(){

    //load signup html page
    window.location.href = "login.html";
    


}

