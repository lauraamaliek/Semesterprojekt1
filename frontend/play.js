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

    //henter de valgte moods fra localStorage, JSON.parse=modtager string fra web-serveren som omskrives til tal
    const activity = JSON.parse(localStorage.getItem("selectedActivity"));
    const MoodsSelectedByActivity = `selectedMoods_${activity.id}`;

    let selectedMoods = JSON.parse(localStorage.getItem(MoodsSelectedByActivity));

    if (!selectedMoods || selectedMoods.length === 0) {//tjekker at selectedMoods findes og er forskellig fra 0
        console.warn("No moods selected!");//kun hvis tom, skrives der "no moods detected" i konsollen
        document.getElementById("trackList").innerHTML = "<p>Vælg venligst et mood for at se sange.</p>";//kun hvis tom, printer <p></p> på siden som html hvor trackList id'et er 
        return;//stopper funktionen hvis tom
    }

    selectedMoods = selectedMoods.map(Number).filter(n => !isNaN(n)); 
    /*.map kører en funktion på alle elementer i arrayet, her kører den funktionen number, som laver alle elementer om til tal, 
    herefter filtrerer den de elementer fra som isNaN (Not a Number) */ 
    

    console.log("Selected moods (as numbers):", selectedMoods);// printer selectedMoods i konsollen, den giver mood_id'er i et array

    try { //man bruger try for at fange potentielle fejl
        const response = await fetch('/api/tracks-by-moods-weighted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'//fortæller serveren at data er i json-format
            },
            body: JSON.stringify({ selectedMoods })//gør det til en string 
        });//sender listen af valgte moods til serveren, med post fordi serveren skal behandle data

        if (!response.ok) {
            throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
        }//hvis serveren svarer med fejl, stopper funktionen og sender en fejlmeddelelse 

        const tracks = await response.json();
        console.log("Tracks returned:", tracks);

        // Viser trackliste på siden
        updateQueue(); //viser "køen"

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

//omregner duration fra "mm:ss" til sekunder i hele tal 
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

    progressInterval = setInterval(() => {
        currentSecond++;//currentSecond skal stige med 1 hver gang

        // Hvis brugeren spoler manuelt, må timeren IKKE overskrive slideren
        if (progressBar.value !== currentSecond) {
        progressBar.value = currentSecond;
        }

        currentTimeEl.textContent = formatSeconds(currentSecond);//opdaterer tiden der er gået i mm:ss

    if (currentSecond >= currentTrackDuration) {//hvis sangen er slut, intervallet stopper og næste sang startes
        clearInterval(progressInterval);
        playNextTrack();   // AUTO NEXT TRACK
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
    const albumImg = document.getElementById("album-img");

    if (titleElement) titleElement.textContent = track.title || "Unknown title";//hvis titel mangler
    if (artistElement) artistElement.textContent = track.artist || "Unknown artist";//hvis kunstner mangler

    const durationSeconds = durationToSeconds(track.duration);

    if (durationElement) {
        durationElement.textContent = track.duration;
    }
    currentSecond = 0;
    progressBar.max = durationSeconds;
    progressBar.value = 0;

    currentTrackDuration = durationSeconds;

  // Dynamisk album-cover
    albumImg.src = `albumPhotos/${track.id}.jpg`; //fortæller at albumImg skal være indsætte jpg, som passer til track.id

    // Hvis fil mangler – fallback
    albumImg.onerror = () => {
        albumImg.src = "albumPhotos/default.jpg";
    };

    startProgressBar();
    updateQueue();
}


//auto-player næste sang og til at skippe til næste sang 
function playNextTrack() {
    if (currentTrackIndex < currentTracklist.length - 1) {
        currentTrackIndex++;//hvis sangen er slut og der er en næste --> afspil denne 
    } else {//hvis køen er slut starter den forfra
        // Playlisten looper:
        currentTrackIndex = 0; 
    }

    updatePlayer(currentTracklist[currentTrackIndex]);
}

// Spol til forrige sang
function playPreviousTrack() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--; // gå én sang tilbage
    } else {
        // Hvis vi er på første sang → hop til sidste (loop)
        currentTrackIndex = currentTracklist.length - 1;
    }

    updatePlayer(currentTracklist[currentTrackIndex]);
}

//køen opdateres dynamisk, og viser max 10 sange af gangen
function updateQueue(){
    const queueList=document.getElementById("next-songs");
    queueList.innerHTML="";

    const total = currentTracklist.length;

    if (total <=1) return;

    const maxVisible =10;

    let startIndex = (currentTrackIndex+1)%total;
    //modulus operatoren dividerer startIndex, med total og resultatet er resten ved division, hvilket gør det muligt for køen at køre i loop

    const upcomingTracks = []
    for (let i=0; i<total -1; i++){
        let idx = (startIndex+i)%total;
        upcomingTracks.push(currentTracklist[idx]);
    }

    const visibleTracks = upcomingTracks.slice(0,maxVisible);

    visibleTracks.forEach(track => {
        const li = document.createElement("li");
        li.innerHTML=`
        <img class="queue-cover" src="albumPhotos/${track.id}.jpg"> 
        <div class="queue-text">
        <strong class="queue-title">${track.title}</strong>
        <em class="queue-artist">${track.artist}</em>
        </div>
        `;
        queueList.appendChild(li);

    });
}

//Const så Play/Pause knap/ikon virker
const playBtn = document.getElementById("play-btn");
const playIcon = document.getElementById("play-icon");

let isPlaying = true;

playBtn.addEventListener("click", () => {
    isPlaying = !isPlaying;

    if (isPlaying) {
        playIcon.textContent = "pause";
        startProgressBar();            // starter progressbaren
    } else {
        playIcon.textContent = "play_arrow";
        clearInterval(progressInterval); // stopper progressbaren
    }
});


//Gør at loadTracks... kører når html er loadet 
window.addEventListener("DOMContentLoaded", () => {
    loadTracksForSelectedMoods();
});//henter tracks automatisk når html-siden er loadet færdigt

//Laver skip knapper
document.getElementById("next").addEventListener("click", () => {
    playNextTrack();
});

document.getElementById("prev").addEventListener("click", () => {
    playPreviousTrack();
});