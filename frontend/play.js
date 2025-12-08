let currentTrackIndex = 0;
let currentTracklist = [];
let currentSecond = 0;
let currentTrackDuration = 0;
let progressInterval = null;

// Hent tracks ud fra valgte moods
async function loadTracksForSelectedMoods() {
    console.log("Loading tracks based on selected moods...");

    // Hent valgte moods fra localStorage og konverter til tal
    let selectedMoods = JSON.parse(localStorage.getItem("selectedMoods"));
    if (!selectedMoods || selectedMoods.length === 0) {
        console.warn("No moods selected!");
        document.getElementById("trackList").innerHTML = "<p>Vælg venligst et mood for at se sange.</p>";
        return;
    }

    selectedMoods = selectedMoods.map(Number).filter(n => !isNaN(n)); // Konverter og filtrer ugyldige
    
    if (selectedMoods.length === 0) {
        console.warn("No valid moods remaining after conversion!");
        document.getElementById("trackList").innerHTML = "<p>Vælg venligst et mood for at se sange.</p>";
        return;
    }

    console.log("Selected moods (as numbers):", selectedMoods);

    try {
        const response = await fetch('/api/tracks-by-moods-weighted', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ selectedMoods })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tracks: ${response.status} ${response.statusText}`);
        }

        const tracks = await response.json();
        console.log("Tracks returned:", tracks);

        // Render til UI (sangliste)
        //displayTracks(tracks); //viser "køen"

        // Gem tracklist til videre brug
        localStorage.setItem("currentTracklist", JSON.stringify(tracks));
        
        currentTracklist = tracks;
        currentTrackIndex = 0;

        // ⭐ NYT: Indlæs den første sang i afspilleren, hvis listen ikke er tom
        if (currentTracklist.length > 0) {
            updatePlayer(currentTracklist[currentTrackIndex]); 
        }

    } catch (err) {
        console.error("Error loading tracks:", err);
        document.getElementById("trackList").innerHTML = `<p>Fejl ved hentning af sange: ${err.message}</p>`;
    }
}

//omregner duration fra "mm:ss" til sekunder i tal 
function durationToSeconds(durationString) {
    if (typeof durationString !== "string") return 0;

    const parts = durationString.split(":");
    if (parts.length !== 2) return 0;

    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);

    if (isNaN(minutes) || isNaN(seconds)) return 0;

    return minutes * 60 + seconds;
}

//laver duration om igen 
function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes)}:${String(seconds).padStart(2, '0')}`;
}

//starter progressbar når funktionen kaldes
function startProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    const currentTimeEl = document.getElementById("current-time");

    if (progressInterval) clearInterval(progressInterval);

    /*currentSecond = 0;*/ // Gør den starter forfra efter Play/Pause så kommateret den lige ud
    progressBar.value = 0;

    progressInterval = setInterval(() => {
        currentSecond++;
        progressBar.value = currentSecond;

        currentTimeEl.textContent = formatSeconds(currentSecond);

    if (currentSecond >= currentTrackDuration) {
        clearInterval(progressInterval);
        playNextTrack();   // 🎉 AUTO NEXT TRACK
        }  
    }, 1000); //hvorfor 1000????

}


//sætter sangen mm. ind i playeren 
function updatePlayer(track) {
    if (!track) return;

    const titleElement = document.getElementById("song-title");
    const artistElement = document.getElementById("song-artist");
    const durationElement = document.getElementById("song-duration");
    const progressBar = document.getElementById("progress-bar");

    if (titleElement) titleElement.textContent = track.title || "Ukendt titel";
    if (artistElement) artistElement.textContent = track.artist || "Ukendt kunstner";

    const durationSeconds = durationToSeconds(track.duration);

    if (durationElement) {
        durationElement.textContent = track.duration;
    }

    progressBar.max = durationSeconds;
    progressBar.value = 0;

    currentTrackDuration = durationSeconds;

    startProgressBar();
}


//auto-player næste sang
function playNextTrack() {
    if (currentTrackIndex < currentTracklist.length - 1) {
        currentTrackIndex++;
    } else {
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
});