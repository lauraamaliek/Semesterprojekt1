let currentTrackIndex = 0; //variablen currentTrackIndex sættes til 0, bruges til at holde styr på hvilken sang der spilles nu
let currentTracklist = []; //der oprettes et tomt array med navnet currentTracklist, her indsættes sange fra valgte moods
let currentSecond = 0; //variablen currentSecond sættes til 0, bruges til progressbaren
let currentTrackDuration = 0; //variablen currentTrackDuration bruges til progressbar
let progressInterval = null; //bruges til progressbaren, gør så den kan stoppes igen

document.getElementById("progress-bar").addEventListener("input", (e) => {
    const newTime = parseInt(e.target.value, 10);
    currentSecond = newTime;

    // Opdater tiden i UI
    document.getElementById("current-time").textContent = formatSeconds(currentSecond);
});

// Funktion som henter tracks ud fra de valgte moods
async function loadTracksForSelectedMoods() {
    console.log("Loading tracks based on selected moods...");//skriver besked i konsollen som fortæller hvad der sker, viser at funktionen er i gang

    // Hent valgte moods fra localStorage og konverter til tal
    let selectedMoods = JSON.parse(localStorage.getItem("selectedMoods"));//henter de valgte moods fra localStorage, JSON.parse=modtager string fra web-serveren som omskrives til tal
    if (!selectedMoods || selectedMoods.length === 0) {//tjekker at selectedMoods findes og er forskellig fra 0
        console.warn("No moods selected!");//kun hvis tom, skrives der "no moods detected" i konsollen
        document.getElementById("trackList").innerHTML = "<p>Vælg venligst et mood for at se sange.</p>";//kun hvis tom, printer <p></p> på siden som html hvor trackList id'et er 
        return;//stopper funktionen hvis tom
    }

    selectedMoods = selectedMoods.map(Number).filter(n => !isNaN(n)); 
    /*.map kører en funktion på alle elementer i arrayet, her kører den funktionen number, som laver alle elementer om til tal, 
    herefter filtrerer den de elementer fra som isNaN (Not a Number) */ 
    
    if (selectedMoods.length === 0) {
        console.warn("No valid moods remaining after conversion!");
        document.getElementById("trackList").innerHTML = "<p>Vælg venligst et mood for at se sange.</p>";
        return;
    } /* tjekker om selectedModds er 0, hvis den er printer den warn i consol og skriver <p></p> på html siden */

    console.log("Selected moods (as numbers):", selectedMoods);// printer selectedMoods i konsollen, den giver mood_id'er i et array

    try { //man bruger try for at fange potentielle fejl
        const response = await fetch('/api/tracks-by-moods-weighted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'//fortæller serveren at data er i json-format
            },
            body: JSON.stringify({ selectedMoods })//gør det til en string c
        });//sender listen af valgte moods til serveren, med post fordi serveren skal behandle data

        if (!response.ok) {
            throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
        }//hvis serveren svarer med fejl, stopper funktionen og sender en fejlmeddelelse 

        const tracks = await response.json();
        console.log("Tracks returned:", tracks);

        // Render til UI (sangliste)
        //displayTracks(tracks); //viser "køen"

        // Gem tracklist til videre brug
        localStorage.setItem("currentTracklist", JSON.stringify(tracks));//gemmer tracklist i localstorage som string
        
        currentTracklist = tracks;
        currentTrackIndex = 0;

        //den første sang i afspilleren indlæses, hvis listen ikke er tom
        if (currentTracklist.length > 0) {
            updatePlayer(currentTracklist[currentTrackIndex]); 
        }

    } catch (err) {
        console.error("Error loading tracks:", err);
        document.getElementById("trackList").innerHTML = `<p>Fejl ved hentning af sange: ${err.message}</p>`;
    }//hvis en fejl fanges sendes en meddelelsen
}

//omregner duration fra "mm:ss" til sekunder i tal 
function durationToSeconds(durationString) {
    if (typeof durationString !== "string") return 0;//spørger om durationString er en string, hvis ikke så skriver den 0

    const parts = durationString.split(":");//splitter string ved :
    if (parts.length !== 2) return 0;//tjekker at der er delt i to

    const minutes = parseInt(parts[0], 10);//laver 1. del af opsplittelsen til integer, i 10-base heltal 
    const seconds = parseInt(parts[1], 10);//laver 2. del af opsplittelsen til integer, i 10-base heltal 

    if (isNaN(minutes) || isNaN(seconds)) return 0;//hvis ikke både minutes og seconds er tal

    return minutes * 60 + seconds;
}

//laver duration om igen 
function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);//math.floor runder ned til nærmeste hele tal, her hvor mange hele minutter 
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;//padStart gør at sekunder altid står som 2 cifre, den fylder på fra venstre så 5 -> 05
}

//starter progressbar når funktionen kaldes
function startProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const currentTimeEl = document.getElementById("current-time");

    if (progressInterval) clearInterval(progressInterval);//Stopper tidligere intervaller

    /*currentSecond = 0;*/ // Gør den starter forfra efter Play/Pause så kommateret den lige ud, skal også være væk for at kunne spole

    progressInterval = setInterval(() => {
        currentSecond++;//currentSecond skal stige med 1 hver gang

        // Hvis brugeren spoler manuelt, må timeren IKKE overskrive slideren
        if (progressBar.value !== currentSecond) {
        progressBar.value = currentSecond;
        }

        currentTimeEl.textContent = formatSeconds(currentSecond);//opdaterer tiden der er gået i mm:ss

    if (currentSecond >= currentTrackDuration) {//hvis sangen er slut, intervallet stopper og næste sang startes
        clearInterval(progressInterval);
        playNextTrack();   // 🎉 AUTO NEXT TRACK
        }  
    }, 1000); //hvorfor 1000-> så funktionen kører hvert 1000 millisekund

}


//sætter sangen mm. ind i playeren 
function updatePlayer(track) {
    if (!track) return;//hvis der ikke er en sang -->stop

    //indsætter på HTML-siden hvor de enkelte id'er står 
    const titleElement = document.getElementById("song-title");
    const artistElement = document.getElementById("song-artist");
    const durationElement = document.getElementById("song-duration");
    const progressBar = document.getElementById("progress-bar");

    if (titleElement) titleElement.textContent = track.title || "Ukendt titel";//hvis titel mangler
    if (artistElement) artistElement.textContent = track.artist || "Ukendt kunstner";//hvis kunstner mangler

    const durationSeconds = durationToSeconds(track.duration);

    if (durationElement) {
        durationElement.textContent = track.duration;
    }
    currentSecond = 0;
    progressBar.max = durationSeconds;
    progressBar.value = 0;

    currentTrackDuration = durationSeconds;

    startProgressBar();
}


//auto-player næste sang
function playNextTrack() {
    if (currentTrackIndex < currentTracklist.length - 1) {
        currentTrackIndex++;//hvis sangen er slut og der er en næste --> afspil denne 
    } else {//hvis køen er slut starter den forfra
        // Hvis du vil loope playlisten:
        currentTrackIndex = 0; 
    }

    updatePlayer(currentTracklist[currentTrackIndex]);
}


/* giver liste af sange som passer til moods. Bruges ikke lige nu, 
// Vis tracks på siden
function displayTracks(tracks) {
    const trackList = document.getElementById("trackList"); //Heder TrackList i .HTML
    trackList.innerHTML = "";

    tracks.forEach(track => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${track.title}</strong><br>
            <em>${track.artist}</em><br>
        `;
        trackList.appendChild(li);
    });
} */

window.addEventListener("DOMContentLoaded", () => {
    loadTracksForSelectedMoods();
});//henter tracks automatisk når html-siden er loadet færdigt