//basically handles buttons for both confirmations
window.addEventListener('DOMContentLoaded', function(){
    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});