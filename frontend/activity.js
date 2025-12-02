const userName = localStorage.getItem('userName');

const activityText = document.getElementById('activityText');

if (userName) {
    activityText.textContent = `What are you doing today, ${userName}?`;
} else {
    activityText.textContent = "What are you doing today?";
}