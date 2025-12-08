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

// Funktion der kaldes når man klikker på knappen, på navn-indtastningen
function goToNextPage() {
    const name = document.getElementById("nameInput").value;

    // Gemmer navnet i browserens localStorage
    localStorage.setItem("username", name);

    // Går videre til næste side
    window.location.href = "greeting.html";
}