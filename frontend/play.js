// SKAL LAVES OM!!!!!
// Hjælpefunktion for at formatere varighed fra sekunder til mm:ss (Beholdes)
/*function formatDuration(totalSeconds) {
    if (typeof totalSeconds !== 'number' || totalSeconds < 0) {
        return '00:00';
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
*/


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
        
        // ⭐ NYT: Indlæs den første sang i afspilleren, hvis listen ikke er tom
        if (tracks.length > 0) {
            updatePlayer(tracks[0]); 
        }

    } catch (err) {
        console.error("Error loading tracks:", err);
        document.getElementById("trackList").innerHTML = `<p>Fejl ved hentning af sange: ${err.message}</p>`;
    }
}

// 🎶 FUNKTION TIL AT INDSÆTTE SANGDETALJER I PLAYEREN
function updatePlayer(track) {
    if (!track) return;

    const titleElement = document.getElementById("song-title");
    const artistElement = document.getElementById("song-artist");
    //const durationElement = document.getElementById("song-duration"); SKAL FIXES

    // Tildel værdierne. Vi tjekker, om elementerne eksisterer først.
    if (titleElement) {
        titleElement.textContent = track.title || "Ukendt titel";
    }
    if (artistElement) {
        artistElement.textContent = track.artist || "Ukendt kunstner";
    }
    // Antager at track.duration er i sekunder
   /* if (durationElement) {
        durationElement.textContent = formatDuration(track.duration);
    }*/
    
    console.log(`Afspiller opdateret med: ${track.title}`);
    // Her kan du tilføje logik for at starte et audio-element, hvis du har et.
}

/*giver liste af sange som passer til moods. Bruges ikke lige nu, 
// Vis tracks på siden
function displayTracks(tracks) {
    const trackList = document.getElementById("trackList");
    trackList.innerHTML = "";

    tracks.forEach(track => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${track.title}</strong><br>
            <em>${track.artist}</em><br>
        `;
        trackList.appendChild(li);
    });
}
*/

window.addEventListener("DOMContentLoaded", () => {
    loadTracksForSelectedMoods();
});