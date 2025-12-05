// -----------------------------
// Hent HTML elementer
// -----------------------------
const titleEl = document.getElementById("songTitle");
const artistEl = document.getElementById("songArtist");
const playBtn = document.getElementById("playBtn");
const timeEl = document.getElementById("time");

// Variabler
let songs = [];
let currentSong = null;
let timeInterval = null;
let fakeTime = 0; // vi simulerer tiden


// -----------------------------
// Hent CSV fil
// -----------------------------
fetch("db/sang_eksempler.csv")
  .then(res => res.text())
  .then(csv => {
    const rows = csv.split("\n").slice(1); // skip header

    songs = rows.map(row => {
      const [id, title, artist, bpm] = row.split(",");
      return { id, title, artist, bpm };
    });

    // Indlæs første sang
    loadSong(songs[0]);
  })
  .catch(err => console.error("CSV fejl:", err));


// -----------------------------
// Function: Indlæs sang
// -----------------------------
function loadSong(song) {
  currentSong = song;

  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;

  resetTime();
}


// -----------------------------
// Play / Pause knap
// -----------------------------
playBtn.addEventListener("click", () => {
  if (playBtn.dataset.state !== "playing") {
    startTimer();
    playBtn.dataset.state = "playing";
    playBtn.textContent = "Pause";
  } else {
    stopTimer();
    playBtn.dataset.state = "paused";
    playBtn.textContent = "Play";
  }
});


// -----------------------------
// Timer simulation
// -----------------------------
function startTimer() {
  stopTimer(); // undgå dobbelte intervaller

  timeInterval = setInterval(() => {
    fakeTime++;

    let min = Math.floor(fakeTime / 60);
    let sec = fakeTime % 60;
    if (sec < 10) sec = "0" + sec;

    timeEl.textContent = `${min}:${sec}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timeInterval);
}

function resetTime() {
  fakeTime = 0;
  timeEl.textContent = "0:00";
  stopTimer();
}
