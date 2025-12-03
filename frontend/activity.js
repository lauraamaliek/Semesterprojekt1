
const userName = localStorage.getItem('userName');

const activityText = document.getElementById('activityText');

if (userName) {
    activityText.textContent = `What are you doing today, ${userName}?`;
} else {
    activityText.textContent = "What are you doing today?";
}
/*
function go() {
    window.location.href = 'mood.html';
} */

function ChooseActivity (id) {
    localStorage.setItem("selectedActivity", JSON.stringify({id})); /*localstorage gemmer lokalt så det kan bruges på næste side, 
    json.stringify gør objektet til en tekst*/
    window.location.href = 'mood.html';
}