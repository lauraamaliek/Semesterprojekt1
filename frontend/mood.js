function goplay() {
    window.location.href = 'play.html';
}
async function loadMoods() { // henter data fra backend (derfor async)
    console.log('hej')
    const activity = JSON.parse(localStorage.getItem ("selectedActivity"));

    const response = await fetch(`/api/moods/${activity.id}`);
    const moods = await response.json();

    const container = document.getElementById("button-row");

    for(let i = 0; i<moods.length; i++) {
        const mood = moods[i];
        container.innerHTML += `
        <button data-id="${mood.id}">
            ${mood.name}
        </button>
        `;
    }
}
loadMoods();