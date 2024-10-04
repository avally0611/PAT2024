//basically handles buttons for both confirmations
window.addEventListener('DOMContentLoaded', function(){
    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', function() {
        returnToIndex();
    });
});

//this function will handle the return button
function returnToIndex()
{
    window.location.href = 'index.html';
}