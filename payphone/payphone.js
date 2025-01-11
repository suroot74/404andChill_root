const display = document.getElementById("display");
let input = "";

function pressKey(key) {
  const dtmfSound = new Audio(`audio/dtmf/${key}.wav`);
  dtmfSound.play();

  input += key;
  display.innerText = formatNumber(input);

  if (input.length === 10) {
    setTimeout(() => {
      const ringSound = new Audio(`audio/payphone/ringing.wav`);
      ringSound.play();

      ringSound.onended = () => {
        playRandomClip();
      };

      display.innerText = "Dial Again:";
      input = "";
    }, 500);
  }
}

function formatNumber(number) {
  if (number.length < 7) return number;

  return number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
}

function playRandomClip() {
  const totalClips = 6;
  const randomIndex = Math.floor(Math.random() * totalClips) + 1;
  const clip = new Audio(`audio/payphone/clips/${randomIndex}.wav`);
  clip.play();
}

document.querySelector(".coin-slot").addEventListener("click", () => {
  const dialTone = new Audio(`audio/payphone/dial_tone.wav`);
  dialTone.play();
});

document.querySelector(".coin-return-slot").addEventListener("click", () => {
  alert("Clink! A coin rolled out. But you can't actually take it.");
});