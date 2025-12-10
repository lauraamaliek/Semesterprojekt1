

async function loadMoods() {
    console.log("Loading moods...");

    const activity = JSON.parse(localStorage.getItem("selectedActivity"));

    // Hent alle moods
    const allMoodsResponse = await fetch(`/api/moods`);
    const allMoods = await allMoodsResponse.json();

    // Hent moods for aktiviteten (default)
    const activityMoodsResponse = await fetch(`/api/moods/${activity.id}`);
    const activityMoods = await activityMoodsResponse.json();

    const defaultMoodIDs = new Set(activityMoods.map(m => m.id));

    const container = document.getElementById("button-row");
    container.innerHTML = "";

    allMoods.forEach(mood => {
        const isDefault = defaultMoodIDs.has(mood.id);

        container.innerHTML += `
            <label class="mood-button ${isDefault ? "selected" : ""}">
                <input 
                    type="checkbox" 
                    class="mood-checkbox"
                    data-id="${mood.id}"
                    ${isDefault ? "checked" : ""}
                >
                ${mood.name}
            </label>
        `;
    });

    // Toggle class når der klikkes
    document.querySelectorAll(".mood-checkbox").forEach(cb => {
        cb.addEventListener("change", () => {
            cb.parentElement.classList.toggle("selected", cb.checked);
        });
    });
}



loadMoods();

//continue knap som er deaktiveret når der ikke er valgt moods 
// Hent continue-knappen
const continueBtn = document.getElementById("continueBtn");

// Funktion til at opdatere knaptekst, gemme valgte moods og aktivere/deaktivere knappen
function updateContinueButton() {
    const selectedCheckboxes = document.querySelectorAll(".mood-checkbox:checked");
    const selectedCount = selectedCheckboxes.length;

    // Hvis ingen valgt → vis venlig prompt og deaktiver knap
    if (selectedCount === 0) {
        continueBtn.textContent = "Select moods to continue";
        continueBtn.disabled = true;
        continueBtn.classList.add("disabled");
        continueBtn.setAttribute("aria-disabled", "true");
    } else {
        continueBtn.textContent = `Continue with ${selectedCount} mood${selectedCount > 1 ? "s" : ""}`;
        continueBtn.disabled = false;
        continueBtn.classList.remove("disabled");
        continueBtn.setAttribute("aria-disabled", "false");
    }

    // Gem valgte moods i localStorage (bevarer din eksisterende adfærd)
    const selectedMoodIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
    localStorage.setItem("selectedMoods", JSON.stringify(selectedMoodIds));
}

// Tilføj event listeners til eksisterende mood-checkboxes
function attachMoodListeners() {
    document.querySelectorAll(".mood-checkbox").forEach(cb => {
        cb.addEventListener("change", () => {
            cb.parentElement.classList.toggle("selected", cb.checked);
            updateContinueButton();
        });
    });
}

// Klik-event til Continue-knappen
continueBtn.addEventListener("click", () => {
    if (!continueBtn.disabled) {
        window.location.href = "play.html";
    }
});

// Initialiser efter moods er loadet
loadMoods().then(() => {
    attachMoodListeners();
    updateContinueButton(); // initial opdatering ved load
});



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





