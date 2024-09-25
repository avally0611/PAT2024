//get pay button to lead to confirmation page
const payButton = document.getElementById("pay-button");
payButton.addEventListener("click", validateCardDetails);

//i will make method for number and expiry to limit bad input
const cardNumber = document.getElementById("cardNumber");
const cardExpiry = document.getElementById("expiryDate");
const cvv = document.getElementById("cvv");

cardNumber.addEventListener('keypress', validateCardNumber);

//format card number as user types
function validateCardNumber(e){
    const cardNumberValue = cardNumber.value;
    if(cardNumberValue.length < 19){
        if (cardNumberValue.length == 4 || cardNumberValue.length == 9 || cardNumberValue.length == 14){
            cardNumber.value += "-";
        }
    }
    else
    {
        //prevent user from typing more than 19 characters
        //e represents event and and prevents event's default action
        e.preventDefault();
    }
}

cardExpiry.addEventListener('keypress', validateCardExpiry);

function validateCardExpiry(e)
{
    const cardExpiryValue = cardExpiry.value;

    if(cardExpiryValue.length < 5){
        if (cardExpiryValue.length == 2){
            cardExpiry.value += "/";
        }
    }
    else
    {
        e.preventDefault();
    }


}

cvv.addEventListener('keypress', validateCVV);

function validateCVV(e){

    const cvvValue = cvv.value;

    if(cvvValue.length == 4){
        e.preventDefault();
    }
}

function validateCardDetails(){

    //get date from expiry date and confirm it after today date (not expired) - then direct to confirmation page
    const today = new Date();

    const expiryDateArray = cardExpiry.value.split("/");
    const expiryMonth = expiryDateArray[0];
    const expiryYear = expiryDateArray[1];

    //create a new date object with the expiry date (ALSO -1 because months IN JS are 0 indexed)
    const expiryDate = new Date('20' + expiryYear, expiryMonth - 1);

    if (expiryDate < today)
    {
        console.log("Card is expired");
        alert("Card is expired");
    }
    else
    {
        console.log("Card is not expired");
        window.location.href = "confirmation.html";

        //we also have to send information about donation to table (monetary donation)
    }
    
}




