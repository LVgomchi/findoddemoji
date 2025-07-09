const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    gameOver: document.getElementById('game-over-screen'),
    leaderboard: document.getElementById('leaderboard-screen'),
};

const uiElements = {
    timer: document.getElementById('timer'),
    score: document.getElementById('score'),
    finalScore: document.getElementById('final-score'),
    personalBest: document.getElementById('personal-best'),
    playerNameInput: document.getElementById('player-name'),
    emojiGrid: document.getElementById('emoji-grid'),
    leaderboardTableBody: document.querySelector('#leaderboard-table tbody'),
};

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
}

function updateTimer(time) {
    uiElements.timer.textContent = time;
}

function updateScore(score) {
    uiElements.score.textContent = score;
}

function displayGameOver(score, personalBest) {
    uiElements.finalScore.textContent = score;
    uiElements.personalBest.textContent = personalBest;
    showScreen('gameOver');
}

function createEmojiGrid(level, emojiSet, oddEmojiPosition, onEmojiClick) {
    const grid = uiElements.emojiGrid;
    grid.innerHTML = ''; // Clear previous grid

    const gridSize = Math.floor(level / 4) + 2;
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const emojiCell = document.createElement('div');
        emojiCell.classList.add('emoji-cell');
        const isOddOne = (i === oddEmojiPosition);
        emojiCell.textContent = isOddOne ? emojiSet.odd : emojiSet.correct;
        emojiCell.dataset.correct = isOddOne;
        emojiCell.addEventListener('click', () => onEmojiClick(isOddOne));
        grid.appendChild(emojiCell);
    }
}

async function displayLeaderboard() {
    const leaderboardData = await getLeaderboard();
    const tableBody = uiElements.leaderboardTableBody;
    tableBody.innerHTML = ''; // Clear previous data

    if (leaderboardData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Leaderboard is empty.</td></tr>';
        return;
    }

    leaderboardData.forEach(player => {
        const row = document.createElement('tr');
        const countryCode = player.country ? player.country.toLowerCase() : '';
        const flagUrl = countryCode ? `https://flagcdn.com/w40/${countryCode}.png` : '';
        
        row.innerHTML = `
            <td>${player.rank}</td>
            <td>${player.name}</td>
            <td>${player.score}</td>
            <td>${flagUrl ? `<img src="${flagUrl}" alt="${player.country}">` : ''}</td>
        `;
        tableBody.appendChild(row);
    });
    showScreen('leaderboard');
}
