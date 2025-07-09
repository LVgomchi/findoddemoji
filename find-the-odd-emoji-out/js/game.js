document.addEventListener('DOMContentLoaded', () => {
    // --- Game State ---
    let score = 0;
    let currentLevel = 1;
    let timer = 60;
    let timerInterval = null;
    let personalBest = localStorage.getItem('personalBest') || 0;
    let audioUnlocked = false;

    // --- Emoji Sets ---
    const emojiSets = [
        // Faces
        { correct: '😀', odd: '😁' },
        { correct: '😊', odd: '😉' },
        { correct: '😮', odd: '😲' },
        { correct: '😴', odd: '😪' },
        { correct: '😇', odd: '😈' },
        // Animals
        { correct: '🐶', odd: '🐺' },
        { correct: '🐱', odd: '🦊' },
        { correct: '🐵', odd: '🙈' },
        { correct: '🐸', odd: '🐢' },
        // Food
        { correct: '🍎', odd: '🍏' },
        { correct: '🍓', odd: '🍒' },
        { correct: '🍕', odd: '🍔' },
        // Symbols & Objects
        { correct: '❤️', odd: '🧡' },
        { correct: '⭐', odd: '✨' },
        { correct: '☀️', odd: '🌙' },
        { correct: '⚪', odd: '⚫' },
        { correct: '⬆️', odd: '⬇️' },
        { correct: '➡️', odd: '⬅️' },
        { correct: '⚽', odd: '🏀' },
        { correct: '⏰', odd: '⏱️' }
    ];

    // --- Audio ---
    const sounds = {
        correct: new Audio('assets/audio/correct.mp3'),
        wrong: new Audio('assets/audio/wrong.mp3'),
        gameOver: new Audio('assets/audio/gameover.mp3')
    };

    // --- DOM Elements ---
    const startButton = document.getElementById('start-button');
    const leaderboardButton = document.getElementById('leaderboard-button');
    const backToStartButton = document.getElementById('back-to-start-button');
    const playAgainButton = document.getElementById('play-again-button');
    const submitScoreButton = document.getElementById('submit-score-button');
    const playerNameInput = document.getElementById('player-name');

    // --- Audio Handling ---
    function unlockAudio() {
        if (audioUnlocked) return;
        Object.values(sounds).forEach(sound => {
            sound.volume = 0;
            sound.play().catch(() => {});
            sound.pause();
            sound.volume = 1;
            sound.currentTime = 0;
        });
        audioUnlocked = true;
    }

    function playSound(soundName) {
        if (!audioUnlocked) return;
        const sound = sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.error(`Could not play sound: ${soundName}`, e));
        }
    }

    // --- Game Logic ---
    function startGame() {
        score = 0;
        currentLevel = 1;
        timer = 60;
        updateScore(0);
        updateTimer(timer);
        showScreen('game');
        generateLevel();
        startTimer();
    }

    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timer--;
            updateTimer(timer);
            if (timer <= 0) {
                endGame();
            }
        }, 1000);
    }

    function generateLevel() {
        const gridSize = Math.floor(currentLevel / 4) + 2;
        const totalCells = gridSize * gridSize;
        const oddEmojiPosition = Math.floor(Math.random() * totalCells);
        const emojiSet = emojiSets[Math.floor(Math.random() * emojiSets.length)];

        createEmojiGrid(currentLevel, emojiSet, oddEmojiPosition, handleEmojiClick);
    }

    function handleEmojiClick(isCorrect) {
        if (isCorrect) {
            score += currentLevel * 100;
            currentLevel++;
            updateScore(score);
            playSound('correct');
            generateLevel();
        } else {
            timer = Math.max(0, timer - 3);
            updateTimer(timer);
            playSound('wrong');
            if (timer <= 0) {
                endGame();
            }
        }
    }

    function endGame() {
        clearInterval(timerInterval);
        playSound('gameOver');
        if (score > personalBest) {
            personalBest = score;
            localStorage.setItem('personalBest', personalBest);
        }
        displayGameOver(score, personalBest);
    }

    async function handleSubmitScore() {
        const name = playerNameInput.value.trim().toUpperCase();
        if (name.length === 3) {
            submitScoreButton.disabled = true;
            submitScoreButton.textContent = 'SUBMITTING...';
            await submitScore(name, score);
            await displayLeaderboard();
            submitScoreButton.disabled = false;
            submitScoreButton.textContent = 'SUBMIT SCORE';
        } else {
            alert('Please enter a 3-character name.');
        }
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', () => {
        unlockAudio();
        startGame();
    });
    leaderboardButton.addEventListener('click', displayLeaderboard);
    backToStartButton.addEventListener('click', () => showScreen('start'));
    playAgainButton.addEventListener('click', startGame);
    submitScoreButton.addEventListener('click', handleSubmitScore);
});