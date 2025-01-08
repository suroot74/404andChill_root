const cyclingWords = [
    "EXTREMELY",
    "BARELY",
    "NOT AT ALL",
    "ABSOLUTELY",
    "MOSTLY",
    "HARDLY",
    "SUPER-DUPER",
    "MARGINALLY",
    "INSANELY",
    "OCCASIONALLY",
    "POSSIBLY",
    "KINDA",
    "SORT OF",
    "UNQUESTIONABLY",
    "IRREVERSIBLY",
    "RIDICULOUSLY",
    "TOTALLY",
    "SURPRISINGLY",
    "UNUSUALLY",
    "MODERATELY",
    "FRANKLY",
    "GENUINELY",
    "OVERWHELMINGLY",
    "MILDLY",
    "CURIOUSLY",
    "WILDLY",
    "TECHNICALLY",
    "THEORETICALLY",
    "NOT REALLY"
];

const sentencesForSpeech = ["Thank you for holding.", "Your call is very important to us.", "Please stay on the line."];

const audioFiles = [
    "assets/audio1.mp3",
    "assets/audio2.mp3",
    "assets/audio3.mp3",
    "assets/audio4.mp3",
    "assets/audio5.mp3",
    "assets/audio6.mp3"
];

let currentAudioIndex = Math.floor(Math.random() * audioFiles.length);
let audio = new Audio(audioFiles[currentAudioIndex]);
audio.loop = true;

const playButton = document.getElementById("play-audio");

document.addEventListener("DOMContentLoaded", () => {
    audio
        .play()
        .then(() => {
            console.log("Audio is autoplaying!");
            playButton.textContent = "⏸";
        })
        .catch((error) => {
            console.warn("Autoplay failed. User interaction is required:", error);
            playButton.textContent = "▶";
        });
});

playButton.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
        playButton.textContent = "⏸";
    } else {
        audio.pause();
        playButton.textContent = "▶";
    }
});

function switchAudio() {
    audio.pause();
    currentAudioIndex = Math.floor(Math.random() * audioFiles.length);
    audio = new Audio(audioFiles[currentAudioIndex]);
    audio.loop = true;
    audio.play().catch((error) => {
        console.warn("Failed to autoplay new audio:", error);
    });
}

setInterval(() => {
    if (!audio.paused) {
        switchAudio();
    }
}, 180000);

audio.addEventListener("error", () => {
    console.error("Audio failed to load. Check the file path!");
});

let wordIndex = 0;
const cyclingWordElement = document.getElementById("cycling-word");
setInterval(() => {
    cyclingWordElement.textContent = cyclingWords[wordIndex];
    wordIndex = (wordIndex + 1) % cyclingWords.length;
}, 2000);

function speakSentence(sentence) {
    const utterance = new SpeechSynthesisUtterance(sentence);
    window.speechSynthesis.speak(utterance);
}

setInterval(() => {
    const randomSentence = sentencesForSpeech[Math.floor(Math.random() * sentencesForSpeech.length)];
    speakSentence(randomSentence);
}, 10000);