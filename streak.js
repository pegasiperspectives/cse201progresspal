// Get the current date and time
const now = new Date();
const today = now.toLocaleDateString();
const todayStartOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

// Get the last opened date and streak counter from localStorage
const lastOpenedDate = localStorage.getItem('lastOpenedDate') || today;
const lastOpenedTime = parseInt(localStorage.getItem('lastOpenedTime')) || now.getTime();
let streakCounter = parseInt(localStorage.getItem('streakCounter')) || 1;
let longestStreak = parseInt(localStorage.getItem('longestStreak')) || 1;

// Check if the extension was opened on the same day
if (lastOpenedDate === today) {
    // Check if the extension was opened after midnight
    if (lastOpenedTime < todayStartOfDay) {
        // Increment the streak counter
        streakCounter++;
    }
} else if (lastOpenedDate !== getYesterdayDate(today)) {
    // Reset the streak counter if the extension wasn't opened yesterday or today
    streakCounter = 1;
}

// Update the longest streak if the current streak is greater
if (streakCounter > longestStreak) {
    longestStreak = streakCounter;
}

// Update the last opened date, time, and streak counter in localStorage
localStorage.setItem('lastOpenedDate', today);
localStorage.setItem('lastOpenedTime', now.getTime());
localStorage.setItem('streakCounter', streakCounter);
localStorage.setItem('longestStreak', longestStreak);

// Display the current streak on the page
if (document.getElementById('streakCounter') != null) {
    document.getElementById('streakCounter').textContent = streakCounter;
    document.getElementById('longestStreak').textContent = longestStreak;
}
/**
 * Helper function to get the date for yesterday
 * @param {string} today - The current date in the format "MM/DD/YYYY"
 * @returns {string} The date for yesterday in the format "MM/DD/YYYY"
 */
function getYesterdayDate(today) {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return yesterday.toLocaleDateString();
}