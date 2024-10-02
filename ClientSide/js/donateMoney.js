const donateButton = document.getElementById('donate-button');
donateButton.addEventListener('click', donateButtonClicked);

window.addEventListener('load', function () {
    console.log('All assets are loaded');
    fetchCharitiesforDropdown();

    
});

function fetchCharitiesforDropdown() {
    fetch('http://localhost:8383/api/charities')
        .then(response => response.json())
        .then(data => {
            createCharityDropdown(data);
            
        })
        .catch(error => {
            console.error('Error: Trying to get data from server', error);
        });

}

function createCharityDropdown(charities){

    const container = document.getElementById('dropdown-menu');
    Array.from(charities).forEach(charity => {

        const listDropdown = document.createElement('li');
        listDropdown.innerHTML = charity.name;

        container.append(listDropdown) ;
        
    });

    searchCharity();
    

}

//this will be the search function: 
function searchCharity(){

    var inputField = document.getElementById('searchInput');
    
    const dropdown = document.getElementById('dropdown-menu');

    //get all the input elements from dropdown
    var charities = dropdown.querySelectorAll('li');
    console.log(charities);
 
    //every time a letter is typed, the searching algorithm will be called)
    inputField.addEventListener('keyup', function() {
        searchComboBox(inputField.value.toLowerCase(), charities);
    });

}

function searchComboBox(input, charities){
    
    
    //do a foreach to check each item in dropdown
    Array.from(charities).forEach(charity => {

        if(charity.innerText != '')
        {
            if (charity.innerText.toLowerCase().includes(input))
                {
                    console.log('match');
                    //when you use .style - you can modify element's css - in this case, we are making it visible (using css property of display)
                    charity.style.display = '';
                }
                else
                {
                    charity.style.display = 'none';
                    console.log('no match');
                }
        
        }
        
    });
}

function donateButtonClicked()
{
    window.location.href = "payment.html";
}

