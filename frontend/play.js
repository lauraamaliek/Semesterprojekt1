(function() {
    const songs = [
        { title: "Song 1", artist: "Artist 1", duration: 225 }, // varighed i sekunder
        { title: "Song 2", artist: "Artist 2", duration: 210 },
        { title: "Song 3", artist: "Artist 3", duration: 240 },
        { title: "Song 4", artist: "Artist 4", duration: 200 },
        { title: "Song 5", artist: "Artist 5", duration: 180 }
    ];

    let currentIndex = 0;
    let isPlaying = false;
    let currentTime = 0; // i sekunder
    let timerInterval = null;

    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const nextSongsList = document.getElementById('next-songs');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');

    function formatTime(sec) {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        return `${minutes}:${seconds.toString().padStart(2,'0')}`;
    }

    function updatePlayer() {
        const currentSong = songs[currentIndex];
        songTitle.textContent = currentSong.title;
        songArtist.textContent = currentSong.artist;
        currentTime = 0;

        // Opdater progress-bar
        progressBar.max = currentSong.duration;
        progressBar.value = currentTime;
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(currentSong.duration);

        // Opdater next track
        nextSongsList.innerHTML = "";
        for (let i = currentIndex + 1; i < songs.length; i++) {
            const li = document.createElement("li");
            li.textContent = `${songs[i].title} - ${songs[i].artist}`;
            nextSongsList.appendChild(li);
        }
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (isPlaying) {
                const songDuration = songs[currentIndex].duration;
                if (currentTime < songDuration) {
                    currentTime++;
                    progressBar.value = currentTime;
                    currentTimeDisplay.textContent = formatTime(currentTime);
                } else {
                    clearInterval(timerInterval); // stopper når sangen er færdig
                    isPlaying = false;
                    playBtn.textContent = "▶️";
                }
            }
        }, 1000);
    }

    // Play/pause
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.textContent = isPlaying ? "⏸" : "▶️";
        if (isPlaying) startTimer();
    });

    // Næste sang
    nextBtn.addEventListener('click', () => {
        if (currentIndex < songs.length - 1) {
            currentIndex++;
            updatePlayer();
            isPlaying = true;
            playBtn.textContent = "⏸";
            startTimer();
        }
    });

    // Forrige sang
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updatePlayer();
            isPlaying = true;
            playBtn.textContent = "⏸";
            startTimer();
        }
    });

    // Progress-bar kan også ændres manuelt
    progressBar.addEventListener('input', () => {
        currentTime = parseInt(progressBar.value);
        currentTimeDisplay.textContent = formatTime(currentTime);
    });

    // Initial load
    updatePlayer();
})();