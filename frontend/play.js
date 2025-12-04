// Tag HTML elementerne
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const volume = document.getElementById("volume");
const progress = document.getElementById("progressBar");
const timeText = document.getElementById("time");


// 1. Hent CSV fra db/
fetch("db/sang_eksempler.csv")
    .then(response => response.text())
    .then(csv => {

        // Split CSV i linjer
        const lines = csv.trim().split("\n");

        // Tag anden linje = første sang
        const data = lines[1].split(",");

        // Sæt data i et objekt
        const song = {
            id: data[0],
            title: data[1],
            artist: data[2],
            bpm: data[3]
        };

        // Opdater UI
        title.textContent = song.title;
        artist.textContent = song.artist;

        // Brug en fast MP3-fil (skift til din sangfil)
        audio.src = "song1.mp3"; // ← SKIFT DENNE
    });


// PLAY
playBtn.addEventListener("click", () => audio.play());

// PAUSE
pauseBtn.addEventListener("click", () => audio.pause());

// VOLUME
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

// OPDATER TID OG PROGRESS BAR
audio.addEventListener("timeupdate", () => {

    if (!audio.duration) return;

    progress.value = (audio.currentTime / audio.duration) * 100;

    const m1 = Math.floor(audio.currentTime / 60);
    const s1 = Math.floor(audio.currentTime % 60);
    const m2 = Math.floor(audio.duration / 60);
    const s2 = Math.floor(audio.duration % 60);

    timeText.textContent =
        `${m1}:${s1.toString().padStart(2,"0")} / ${m2}:${s2.toString().padStart(2,"0")}`;
});

// SPOL
progress.addEventListener("input", () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
});
