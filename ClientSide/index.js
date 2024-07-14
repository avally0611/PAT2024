

//get input, get list of passwords, check if input is in list of passwords and print to console
const button = document.getElementById('loginButt');


button.addEventListener('click', function() {
    console.log('Button clicked');
    var username = document.getElementById('email').value;
    var password = document.getElementById('pass').value;
    console.log(username + " " + password);

    const baseUrl = 'http://localhost:8383/';
    const responsePromise = fetch(`${baseUrl}api/verifyLogin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    }
    
);

