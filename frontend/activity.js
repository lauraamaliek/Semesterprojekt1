
const userName = localStorage.getItem('userName');

const activityText = document.getElementById('activityText');

if (userName) {
    activityText.textContent = `What are you doing today, ${userName}?`;
} else {
    activityText.textContent = "What are you doing today?";
}



async function getAllActivities() {
    const response = await fetch("/api/activities"); //henter fra api'en 
    const activities = await response.json(); //venter på svar fra backend

    //fortæller at den skal indsætte knapperne i id'et activity-container i html 
    const container = document.getElementById("activity-container");
    container.classList.add("button-row");
    
    for (let i=0; i<activities.length; i++) { //for loop, gennemgår fra 0 og til tabellen er slut, i stiger med 1 hver gang 
        const activity = activities[i];

        //laver knappen som et DOM-element 
        const button = document.createElement("button"); //opretter knappen 
        button.dataset.id=activity.id;
        button.innerText=activity.name; //viser aktivitets-navn på knappen

        //tilføjer klik-event direkte på knappen 
        button.addEventListener("click", () => {
            localStorage.setItem(
                "selectedActivity", JSON.stringify({
                    id: activity.id,
                    name: activity.name
                })
            );
            window.location.href="mood.html";
        });
    
        container.appendChild(button); //tilføjer knappen til DOM'en 
    }
}

getAllActivities()