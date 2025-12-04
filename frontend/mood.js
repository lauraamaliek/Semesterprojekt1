function goplay() {
    window.location.href = 'play.html';
}


async function loadMoods() { // henter data fra backend (derfor async)
    console.log('hej')
    const activity = JSON.parse(localStorage.getItem ("selectedActivity"));

    const response = await fetch(`/api/moods/${activity.id}`);
    const moods = await response.json();

    const container = document.getElementById("button-row");
    container.classList.add("button-row");


    for(let i = 0; i<moods.length; i++) {
        const mood = moods[i];
        container.innerHTML += `
        <button class="mood-button" data-id="${mood.id}">
            ${mood.name}
        </button>
        `;
    }
}

loadMoods();

/*forsøg på at indsætte navnet på valgt aktivitet virker ikke, fungerende kode står nedenfor
async function getActivityId() {
    const id = JSON.parse(localStorage.getItem("selectedActivity"));

    const response = await fetch (`/api/activity/${id.name}`);
    const activity = await response.json();

    document.getElementById("chosen-activity").innerText = activity.name;
}

getActivityId();
*/

//her indsættes navnet på den valgte aktivitet
document.addEventListener("DOMContentLoaded", ()=>{
    const storedActivity = localStorage.getItem("selectedActivity");

    if (storedActivity) {
        const activity= JSON.parse(storedActivity);
        const element = document.getElementById("activityText");

        if (element && activity.name) {
            element.textContent =`Perfect for ${activity.name}! Select moods to include:`;
        }
    } 
});


//forsøg på select/deselect - virker ikke, hvorfor vides ikke!!!
document.addEventListener("click", e => {
    if (e.target.classList.contains("mood-button")) {
        e.target.classList.toggle("selected");
    }
});
