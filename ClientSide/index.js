//get input, get list of passwords, check if input is in list of passwords and print to console
const button = document.getElementById('loginButt');

button.addEventListener('click', verifyData);

function verifyData() {
    console.log('Button clicked');
    var username = document.getElementById('email').value;
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

    }).then(response => response.text()).then(data => 
    {
        console.log(data);
        if (data == 'true')
        {
            console.log('Login successful');
            
        }
        else
        {
            console.log('Login failed');
        }

  
});
    
    
}

