// Get the current date
const today1 = new Date().toISOString().slice(0, 10);

// Get the last day used from localStorage
const lastDayUsed = localStorage.getItem('lastDayUsed') || null;

// Get the number of days used from localStorage
let daysUsed = parseInt(localStorage.getItem('daysUsed'), 10) || 0;

// If the last day used is not today, increment the days used and update the last day used
if (lastDayUsed !== today1) {
  daysUsed += 1;
  localStorage.setItem('lastDayUsed', today1);
  localStorage.setItem('daysUsed', daysUsed.toString());
}
document.getElementById('days-used').textContent = daysUsed;

// You can log the number of days used for debugging purposes
console.log(`Days used: ${daysUsed}`);