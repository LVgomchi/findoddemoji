const API_BASE_URL = '/'; // Assuming the server is running on the same host

async function getLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}leaderboard`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return []; // Return empty array on error
    }
}

async function submitScore(name, score) {
    try {
        const response = await fetch(`${API_BASE_URL}submit-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, score }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error submitting score:', error);
        return { success: false, error: error.message };
    }
}
