(function() {
    // Check om variablen allerede findes, hvis ikke, deklarer
    const songs = [
        { title: "Song 1", artist: "Artist 1" },
        { title: "Song 2", artist: "Artist 2" },
        { title: "Song 3", artist: "Artist 3" },
        { title: "Song 4", artist: "Artist 4" },
        { title: "Song 5", artist: "Artist 5" }
    ];

    let currentIndex = 0;

    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const nextSongsList = document.getElementById('next-songs');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    // Opdater player
    function updatePlayer() {
        const currentSong = songs[currentIndex];
        songTitle.textContent = currentSong.title;
        songArtist.textContent = currentSong.artist;

        // Opdater next track
        nextSongsList.innerHTML = "";
        for (let i = currentIndex + 1; i < songs.length; i++) {
            const li = document.createElement("li");
            li.textContent = `${songs[i].title} - ${songs[i].artist}`;
            nextSongsList.appendChild(li);
        }
    }

    // Simuler play/pause
    let isPlaying = false;
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.textContent = isPlaying ? "⏸" : "▶️";
    });

    // Næste sang
    nextBtn.addEventListener('click', () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
            updatePlayer();
            isPlaying = true;
            playBtn.textContent = "⏸";
        }
    });

    // Forrige sang
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updatePlayer();
            isPlaying = true;
            playBtn.textContent = "⏸";
        }
    });

    // Initial load
    updatePlayer();
})();
