/*kode der husker navn til næste side*/
const nextBtn = document.getElementById('nextBtn');
const nameInput = document.getElementById('nameInput');

nextBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if(name) {
        // Gem navnet i localStorage
        localStorage.setItem('userName', name);
        // Gå videre til greeting.html
        window.location.href = 'greeting.html';
    } else {
        alert('Please enter your name!');
    }
});
