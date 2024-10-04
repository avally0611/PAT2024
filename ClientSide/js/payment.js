// Get pay button to lead to confirmation page
const payButton = document.getElementById("pay-button");
payButton.addEventListener("click", function(event){
    event.preventDefault(); // Prevent default form submission
    validateCardDetails(); // Validate card details
});

const cancelButton = document.getElementById("cancelButt");
cancelButton.addEventListener("click", function(event){
    event.preventDefault(); // Prevent default action
    window.location.href = "donateMoney.html"; // Redirect to donate money page
});

// Get card number, expiry date, and CVV elements
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("expiryDate");
const cvv = document.getElementById("cvv");

// Add event listener to card number input
cardNumber.addEventListener('keypress', validateCardNumber);

// Format card number as user types
// @param {Event} e - The event object
function validateCardNumber(e){
    const cardNumberValue = cardNumber.value; // Get current card number value
    if(cardNumberValue.length < 19){
        // Add hyphen after every 4th character
        if (cardNumberValue.length == 4 || cardNumberValue.length == 9 || cardNumberValue.length == 14){
            cardNumber.value += "-";
        }
    }
    else
    {
        // Prevent user from typing more than 19 characters
        e.preventDefault();
    }
}

// Add event listener to card expiry input
cardExpiry.addEventListener('keypress', validateCardExpiry);

// Format expiry date as user types
// @param {Event} e - The event object
function validateCardExpiry(e)
{
    const cardExpiryValue = cardExpiry.value; // Get current expiry date value

    if(cardExpiryValue.length < 5){
        // Add slash after 2 characters
        if (cardExpiryValue.length == 2){
            cardExpiry.value += "/";
        }
    }
    else
    {
        // Prevent user from typing more than 5 characters
        e.preventDefault();
    }
}

// Add event listener to CVV input
cvv.addEventListener('keypress', validateCVV);

// Limit CVV to 4 characters
// @param {Event} e - The event object
function validateCVV(e){

    const cvvValue = cvv.value; // Get current CVV value

    if(cvvValue.length == 4){
        // Prevent user from typing more than 4 characters
        e.preventDefault();
    }
}

// Validate card details and send to server
function validateCardDetails(){

    // Get today's date
    const today = new Date();

    // Split expiry date into month and year
    const expiryDateArray = cardExpiry.value.split("/");
    const expiryMonth = expiryDateArray[0];
    const expiryYear = expiryDateArray[1];

    // Create a new date object with the expiry date (months are 0 indexed in JS)
    const expiryDate = new Date('20' + expiryYear, expiryMonth - 1);

    // Check if the card is expired
    if (expiryDate < today)
    {
        console.log("Card is expired");
        alert("Card is expired");
    }
    else
    {
        console.log("Card is not expired");

        addDonation(); // Add donation

        // We also have to send information about donation to table (monetary donation)
    }
    
}

// Send donation to server
function addDonation()
{
    const username = sessionStorage.getItem('username'); // Get username from session storage
    const monetaryDonation = JSON.parse(sessionStorage.getItem('monetaryDonation')); // Get monetary donation details from session storage
    console.log(monetaryDonation);
    
    const charity = monetaryDonation.charity; // Get charity name
    const amount = monetaryDonation.amount; // Get donation amount
    fetch('http://localhost:8383/api/addMonetaryDonation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, charity, amount}), // Send username, charity, and amount as JSON
    })
    .then(response => response.text())
    .then(data => {

        if (data === 'true')
        {
            console.log('Donation successful');
            alert("Donation successful");
            window.location.href = "confirmation.html"; // Redirect to confirmation page
        }
    })
    .catch((error) => {
        console.error('Error:', error);
       
    });

}
