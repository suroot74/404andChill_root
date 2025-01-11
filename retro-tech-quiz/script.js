document.addEventListener("DOMContentLoaded", async () => {
    const questionsData = {};
    const footerData = { links: [] };
    const rounds = 3;
    const categoriesPerRound = 3;
    const roundPoints = [100, 200, 400, 800];
    let currentRound = 0;
    let completedQuestions = 0;
    let usedCategories = new Set();
    let currentScore = 0;
    let streak = 0; // Streak tracker for bonus points
    const modal = document.getElementById("question-modal");

    async function loadJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to load JSON from ${url}: ${response.statusText}`);
                return {};
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading JSON from ${url}:`, error);
            return {};
        }
    }

    async function initializeGame() {
        try {
            questionsData.categories = (await loadJSON('./data/questions.json')).categories || [];
            footerData.links = (await loadJSON('../footer.json')).links || [];

            populateFooter();
            setupBackgroundMusic();
            setupScoreDisplay();
            setupAccessibility(); // Accessibility setup
            enableKeyboardNavigation(); // Keyboard navigation setup
            startRound();
        } catch (error) {
            console.error("Initialization error:", error);
        }
    }

    function populateFooter() {
        const footer = document.getElementById("dynamic-footer");
        if (footerData.links.length === 0) {
            console.error("No footer links found.");
            return;
        }
        footer.innerHTML = footerData.links
            .map(link => `<a href="${link.url}" target="_blank">${link.text}</a>`)
            .join(' | ');
    }

    function setupBackgroundMusic() {
        const backgroundMusic = new Audio('./assets/audio/retro-ambiance.mp3');
        backgroundMusic.loop = true;

        const muteButton = document.createElement('button');
        muteButton.id = 'mute-button';
        muteButton.textContent = '🔇 Mute';
        muteButton.style.position = 'fixed';
        muteButton.style.top = '10px';
        muteButton.style.right = '10px';
        muteButton.style.zIndex = '1000';

        muteButton.addEventListener("click", () => {
            if (backgroundMusic.paused) {
                backgroundMusic.play();
                muteButton.textContent = '🔇 Mute';
            } else {
                backgroundMusic.pause();
                muteButton.textContent = '🔊 Unmute';
            }
        });

        document.body.appendChild(muteButton);
        backgroundMusic.play();
    }

    function setupScoreDisplay() {
        const scoreElement = document.createElement('div');
        scoreElement.id = 'score-display';
        scoreElement.textContent = `Score: ${currentScore}`;
        scoreElement.style.position = 'fixed';
        scoreElement.style.bottom = '10px';
        scoreElement.style.right = '10px';
        scoreElement.style.background = '#241235';
        scoreElement.style.color = '#f3e8ff';
        scoreElement.style.padding = '10px 15px';
        scoreElement.style.borderRadius = '8px';
        scoreElement.style.boxShadow = '0 0 10px #d6b4ff';

        document.body.appendChild(scoreElement);
    }

    function updateScore(points, isCorrect) {
        const scoreElement = document.getElementById('score-display');
        if (isCorrect) {
            streak++;
            const bonus = streak >= 3 ? 50 : 0; // Bonus points for 3+ streak
            currentScore += points + bonus;
        } else {
            streak = 0; // Reset streak on incorrect answer
            currentScore -= points; // Deduct points for wrong answer
        }

        scoreElement.textContent = `Score: ${currentScore}`;
        scoreElement.style.animation = 'pulse 0.5s'; // Animate score update
        setTimeout(() => (scoreElement.style.animation = ''), 500);
    }

    function addCategoryIcons(categoryElement, categoryName) {
        const iconMap = {
            "Identify This Sound": "cassette.png",
            "Retro Tech Trivia": "floppy-disk.png",
            "Retro Games": "retro-games.png",
            "Iconic Tech Ads": "ads.png",
            "Who Said This Meme?": "who-said.png",
            "Retro TV Tech": "retro-tv.png",
            "80s and 90s Toy Gadgets": "gadgets.png",
            "Vintage Computers": "vintage-comp.png",
            "Retro Sci-Fi Devices": "retro-dev.png",
            "Early Mobile Tech": "early-mobile.png",
            "Classic Cameras": "cameras.png",
            "Vintage Home Appliances": "vint-app.png",
            "Retro Tech Icons": "icons.png",
            "Gaming Consoles Evolution": "evolution.png",
            "Old School Office Equipment": "old-office.png",
            "Pioneering Internet Platforms": "platforms.png",
            "Early Digital Music Players": "music.png",
        };

        const icon = iconMap[categoryName];
        if (icon) {
            const img = document.createElement('img');
            img.src = `./assets/icons/${icon}`;
            img.alt = `${categoryName} Icon`;
            img.style.width = '30px';
            img.style.marginRight = '10px';

            categoryElement.prepend(img);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getRandomCategories(num) {
        const availableCategories = shuffleArray(questionsData.categories.filter(
            category => !usedCategories.has(category.name)
        ));
        const selected = availableCategories.slice(0, num);
        selected.forEach(cat => usedCategories.add(cat.name));
        return selected;
    }

    function getRandomQuestions(category, basePoints) {
        const shuffled = shuffleArray([...category.questions]);
        return shuffled.slice(0, 3).map((q, i) => ({
            ...q,
            points: basePoints * (i + 1)
        }));
    }

    function startRound() {
        if (currentRound >= rounds) {
            alert("Game Over! Thanks for playing!");
            return;
        }

        const quizBoard = document.getElementById("quiz-board");
        quizBoard.innerHTML = "";

        const roundCategories = getRandomCategories(categoriesPerRound);
        roundCategories.forEach((category) => {
            const column = document.createElement("div");
            column.classList.add("quiz-column");
            column.innerHTML = `<h3>${category.name}</h3>`;

            addCategoryIcons(column.querySelector("h3"), category.name);

            const questions = getRandomQuestions(category, roundPoints[currentRound]);
            questions.forEach((question) => {
                const box = document.createElement("div");
                box.classList.add("quiz-box");
                box.textContent = `${question.points} points`;
                box.addEventListener("click", () => showQuestion(question, box));
                column.appendChild(box);
            });

            quizBoard.appendChild(column);
        });

        setupCategoryHoverEffects(); // Initialize hover effects
        currentRound++;
    }

    function setupCategoryHoverEffects() {
        const categoryDescriptions = {
            "Identify This Sound": "Guess the retro sound!",
            "Retro Tech Trivia": "How much do you know about old-school gadgets?",
            "Retro Games": "Pixelated fun from the past!",
            "Iconic Tech Ads": "Classic ads that defined tech.",
            "Who Said This Meme?": "Retro meme origins await!",
            "Retro TV Tech": "Remember the golden age of CRT?",
            "80s and 90s Toy Gadgets": "Childhood tech from decades past.",
            "Vintage Computers": "Relics of the computing world.",
            "Retro Sci-Fi Devices": "Gadgets from the future's past.",
            "Early Mobile Tech": "Before smartphones ruled the world.",
            "Classic Cameras": "Snap into the analog era.",
            "Vintage Home Appliances": "Home tech your grandparents loved.",
            "Retro Tech Icons": "The legendary tech of yore.",
            "Gaming Consoles Evolution": "A journey through consoles.",
            "Old School Office Equipment": "Tech for the 9-to-5 grind.",
            "Pioneering Internet Platforms": "The dawn of online culture.",
            "Early Digital Music Players": "Before streaming, there was this."
        };

        document.querySelectorAll(".quiz-column h3").forEach(header => {
            if (header.nodeName === "H3") { // Safeguard against external interference
                const categoryName = header.textContent.trim();
                const description = categoryDescriptions[categoryName];

                if (description) {
                    header.setAttribute("title", description); // Add tooltip

                    header.addEventListener("mouseenter", () => {
                        header.style.color = "#f3e8ff";
                        header.style.textShadow = "0 0 15px #f3e8ff";
                    });

                    header.addEventListener("mouseleave", () => {
                        header.style.color = "#d6b4ff";
                        header.style.textShadow = "0 0 10px #d6b4ff";
                    });
                }
            }
        });
    }

    function setupAccessibility() {
        document.querySelectorAll('.quiz-box').forEach(box => {
            box.setAttribute('role', 'button');
            box.setAttribute('tabindex', '0');
            box.setAttribute('aria-label', `Question worth ${box.textContent}`);
        });

        document.querySelectorAll('.answer-button').forEach(button => {
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');
        });

        document.querySelectorAll('.close-button').forEach(button => {
            button.setAttribute('role', 'button');
            button.setAttribute('aria-label', 'Close question modal');
        });
    }

    function enableKeyboardNavigation() {
        document.addEventListener('keydown', event => {
            const activeElement = document.activeElement;

            if (event.key === 'Enter' && activeElement.classList.contains('quiz-box')) {
                activeElement.click();
            }

            if (event.key === 'Enter' && activeElement.classList.contains('answer-button')) {
                activeElement.click();
            }

            if (event.key === 'Enter' && activeElement.classList.contains('close-button')) {
                activeElement.click();
            }
        });
    }

    function showQuestion(question, boxElement) {
        const modalContent = modal.querySelector(".modal-content");
        const mediaContent = [];

        if (question.audio) {
            mediaContent.push(`
                <audio controls>
                    <source src="./assets/audio/${question.audio}" type="audio/mpeg">
                    Your browser does not support the audio element.
                </audio>
            `);
        }

        if (question.image) {
            mediaContent.push(`
                <img src="./assets/${question.image}" alt="Question Image" style="max-width: 100%; margin-top: 10px;" />
            `);
        }

        modalContent.innerHTML = `
            <span class="close-button">&times;</span>
            <h2>${question.question}</h2>
            ${mediaContent.join('')}
            <div class="answer-buttons">
                ${question.options.map((opt) => `
                    <button class="answer-button" data-correct="${opt === question.answer}">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;

        modal.classList.add("visible");

        modal.querySelector(".close-button").addEventListener("click", closeModal);
        modal.querySelectorAll(".answer-button").forEach(button => {
            button.addEventListener("click", e => handleAnswer(e, boxElement, question.points));
        });
    }

    function closeModal() {
        modal.classList.add("closing");
        modal.addEventListener("animationend", () => {
            modal.classList.remove("visible", "closing");
        }, { once: true });
    }

    function handleAnswer(event, boxElement, points) {
        const isCorrect = event.target.getAttribute("data-correct") === "true";
        alert(isCorrect ? "Correct!" : "Incorrect!");
        updateScore(points, isCorrect);
        closeModal();
        boxElement.classList.add("answered");
        boxElement.removeEventListener("click", showQuestion);

        completedQuestions++;
        if (completedQuestions === categoriesPerRound * 3) {
            completedQuestions = 0;
            startRound();
        }
    }

    initializeGame();
});
