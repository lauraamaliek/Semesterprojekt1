
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

    selectedMoods = selectedMoods.map(Number); // ✅ Konverter til tal
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
            throw new Error("Failed to fetch tracks");
        }

        const tracks = await response.json();
        console.log("Tracks returned:", tracks);

        // Render til UI
        displayTracks(tracks);

        // Gem tracklist til videre brug
        localStorage.setItem("currentTracklist", JSON.stringify(tracks));

    } catch (err) {
        console.error("Error loading tracks:", err);
        document.getElementById("trackList").innerHTML = "<p>Fejl ved hentning af sange.</p>";
    }
}

function playTrack(){}


//så den vises på siden
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


window.addEventListener("DOMContentLoaded", () => {
    loadTracksForSelectedMoods();
});


/*if (tracks.length > 0) {
    const firstTrack = tracks[0];
    playTrack(firstTrack);
}
*/

