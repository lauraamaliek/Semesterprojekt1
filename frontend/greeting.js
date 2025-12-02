// Hent navnet fra localStorage
const userName = localStorage.getItem('userName');

// Find h1-elementet
const greeting = document.getElementById('greeting');

// Find nuværende time
const hour = new Date().getHours();

let text = "";

// Bestem hilsen ud fra tidspunktet
if (hour >= 6 && hour < 10) {
    text = "Goodmorning";
} else if (hour >= 10 && hour < 14) {
    text = "Good day";
} else if (hour >= 14 && hour < 18) {    
    text = "Good afternoon";
} else if (hour >= 18 && hour < 23) {
    text = "Good evening";
} else {
    text = "Good night";
}

// Sæt hilsen + navn
if (userName) {
    greeting.textContent = `${text} ${userName}!`;
} else {
    greeting.textContent = text;
}