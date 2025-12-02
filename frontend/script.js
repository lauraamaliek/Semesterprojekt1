// Funktion der kaldes når man klikker på knappen
function goToNextPage() {
    const name = document.getElementById("nameInput").value;

    // Gemmer navnet i browserens localStorage
    localStorage.setItem("username", name);

    // Går videre til næste side
    window.location.href = "greeting.html";
}

// Når greeting.html loader, sæt teksten
window.onload = function () {
    const name = localStorage.getItem("username");

    if (name) {
        document.getElementById("greeting").textContent = "Godmorgen " + name;
    }
}