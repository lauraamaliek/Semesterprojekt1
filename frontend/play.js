// --- KONFIGURATION: SANGDATA ---
// Bemærk: Du skal erstatte 'path/to/din/sang.mp3' med stien til din lydfil.
const trackList = [
    { 
        title: "Perfect Day", 
        artist: "Various Artists", 
        source: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Sample-MP4-Video-File.mp4", 
        duration: "4:15" 
    }
];

let currentTrackIndex = 0; // Holder styr på, hvilken sang der spilles (starter ved index 0)
const audioPlayer = document.getElementById('audioPlayer'); // Henter HTML <audio> elementet

// --- HENTER UI ELEMENTER (DOM) ---
const playBtn = document.getElementById('playBtn');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const durationLabel = document.getElementById('duration');
const currentTimeLabel = document.getElementById('currentTime');
const albumCover = document.getElementById('albumCover');


// --- FUNKTION: FORMATTERER TID TIL MM:SS ---
// Gør f.eks. 154 sekunder til "02:34"
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    // Tilføjer et førende nul, hvis sekunder er < 10 (f.eks. 05)
    return `${min}:${sec < 10 ? '0' : ''}${sec}`; 
}


// --- FUNKTION: INDLÆSER SANGDATA ---
function loadTrack(index) {
    const track = trackList[index];
    
    // 1. Viser sangens titel og artist
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    
    // 2. Indlæser lydfilen
    audioPlayer.src = track.source;
    
    // 3. Nulstil UI for en ny sang
    progressBar.value = 0;
    currentTimeLabel.textContent = '0:00';
    durationLabel.textContent = track.duration; // Vises indtil metadata er indlæst
    document.documentElement.style.setProperty('--progress', '0%');
}


// --- FUNKTION: HÅNDTERER SLIDER FYLDFARVE (Progress Bar og Volumen) ---
// Denne funktion opdaterer CSS-variablen, hvilket får farven til at "fylde"
function updateSliderFill(slider, variableName) {
    // Beregner sliderens procentvise værdi (fra 0 til 100)
    const value = slider.value;
    const max = slider.max;
    const percent = (value / max) * 100;

    // Opdaterer CSS-variablen (--volume eller --progress) i <html> elementet
    document.documentElement.style.setProperty(variableName, `${percent}%`);
}


// ----------------------------------------------------------------------
// --- LYTTERE / EVENTS ---
// ----------------------------------------------------------------------

// 1. HÅNDTERING AF PLAY/PAUSE
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.querySelector('.play-symbol').textContent = '⏸'; // Skift til pause-ikon
    } else {
        audioPlayer.pause();
        playBtn.querySelector('.play-symbol').textContent = '▶'; // Skift til play-ikon
    }
}
playBtn.addEventListener('click', togglePlay);


// 2. HÅNDTERING AF VOLUMEN (Input: Når brugeren trækker i knoppen)
volumeSlider.addEventListener('input', (e) => {
    // Opdaterer CSS-variabel for farvefyld
    updateSliderFill(e.target, '--volume');
    
    // Opdaterer den faktiske lydstyrke på audio-elementet (0-1)
    audioPlayer.volume = e.target.value / 100;
});


// 3. HÅNDTERING AF LIKE KNAP (RØD FARVE)
likeBtn.addEventListener('click', () => {
    // Skifter klassen 'liked' til og fra. CSS sørger for den røde farve
    likeBtn.classList.toggle('liked'); 
});


// 4. OPDATERING AF PROGRESS BAR I REALTID (TIDSLINJE)
audioPlayer.addEventListener('timeupdate', () => {
    // Dette event udløses mange gange i sekundet, mens sangen spiller

    // Beregner den aktuelle tid som en procentdel af den samlede varighed
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;

    // a) Opdaterer progress bar elementet (flytter knoppen)
    progressBar.value = progressPercent;

    // b) Opdaterer CSS-variabel for farvefyld
    updateSliderFill(progressBar, '--progress');

    // c) Opdaterer teksten for den aktuelle tid (f.eks. 1:30)
    currentTimeLabel.textContent = formatTime(audioPlayer.currentTime);
});


// 5. NÅR LYDFILEN ER FÆRDIG INDLÆST (Metadata som varighed er kendt)
audioPlayer.addEventListener('loadedmetadata', () => {
    // Opdaterer den samlede varighed på UI'et med den rigtige værdi fra filen
    durationLabel.textContent = formatTime(audioPlayer.duration);
    
    // Sætter den maksimale værdi for progress bar til 100
    progressBar.max = 100;
});


// 6. HÅNDTERING AF, NÅR BRUGEREN TRÆKKER I PROGRESS BAR'EN
progressBar.addEventListener('input', (e) => {
    // Beregner den nye tid baseret på hvor brugeren trak hen
    const newTime = (e.target.value / 100) * audioPlayer.duration;
    
    // Indstiller audio-elementet til den nye tid
    audioPlayer.currentTime = newTime;
    
    // Opdaterer farvefyldet med det samme (visuel feedback)
    updateSliderFill(e.target, '--progress');
});


// --- INITIALISERING ---
loadTrack(currentTrackIndex); // Indlæser den første sang ved start

// Sikrer at volumen-slideren får farvefyld ved start
updateSliderFill(volumeSlider, '--volume'); 