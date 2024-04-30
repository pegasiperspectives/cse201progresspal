// Get the current date
const today = new Date().toLocaleDateString();

// Get the last opened date and streak counter from localStorage
const lastOpenedDate = localStorage.getItem('lastOpenedDate');
let streakCounter = parseInt(localStorage.getItem('streakCounter')) || 1;
let longestStreak = parseInt(localStorage.getItem('longestStreak')) || 1;

// Check if the extension was opened yesterday
if (lastOpenedDate === getYesterdayDate(today)) {
    // Increment the streak counter
    streakCounter++;
} else if (lastOpenedDate !== today) {
    // Reset the streak counter if the extension wasn't opened yesterday or today
    streakCounter = 1;
}

if (streakCounter > longestStreak) {
    longestStreak = streakCounter;
}

// Update the last opened date and streak counter in localStorage
localStorage.setItem('lastOpenedDate', today);
localStorage.setItem('streakCounter', streakCounter);
localStorage.setItem('longestStreak', longestStreak);

// Display the current streak on the page
document.getElementById('streakCounter').textContent = streakCounter;
document.getElementById('longestStreak').textContent = longestStreak;

/**
 * Helper function to get the date for yesterday
 * @param {string} today - The current date in the format "MM/DD/YYYY"
 * @returns {string} The date for yesterday in the format "MM/DD/YYYY"
 */
function getYesterdayDate(today) {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return yesterday.toLocaleDateString();
}