document.addEventListener("DOMContentLoaded", () => {
    const staticSound = document.getElementById("static-sound");

    staticSound.volume = 0.3;

    document.addEventListener("keydown", (event) => {
        if (event.key === "m") {
            staticSound.muted = !staticSound.muted;
        }
    });
});
