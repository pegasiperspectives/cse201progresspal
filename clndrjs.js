let currentYear, currentMonth;

function generateCalendar(year, month) {
  const container = document.getElementById('calendar-container');
  const date = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = date.getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  chrome.storage.local.get(['dueDates'], function(result) {
    const dueDates = result.dueDates || {};

    const taskCountPerDay = {}; // Object to store task count per day

    // Loop through dueDates and count tasks for each day
    for (const [taskId, dueDate] of Object.entries(dueDates)) {
      const dueDateObj = new Date(dueDate); // Convert the string to a Date object
      const dueDay = dueDateObj.getDate(); // Get the day from the Date object

      if (dueDateObj.getFullYear() === year && dueDateObj.getMonth() === month - 1) {
        const dayCount = taskCountPerDay[dueDay] || 0;
        taskCountPerDay[dueDay] = dayCount + 1;
      }
    }

    let calendarHTML = `
      <h3 class="month-name">${monthNames[month - 1]} ${year}</h3>
      <table class="calendar">
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
    `;

    let day = 1;

    for (let i = 0; i < 6; i++) {
      calendarHTML += "<tr>";

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayIndex) {
          calendarHTML += "<td></td>";
        } else if (day > daysInMonth) {
          break;
        } else {
          const currentDate = new Date(year, month - 1, day);
          const today = new Date();

          let dayHTML = day.toString();

          // Add task count for the day, if any
          const taskCount = taskCountPerDay[day] || 0;
          if (taskCount > 0) {
            dayHTML += ` (${taskCount})`;
          }

          if (currentDate.toDateString() === today.toDateString()) {
            calendarHTML += `<td class="today">${dayHTML}</td>`;
          } else {
            calendarHTML += `<td>${dayHTML}</td>`;
          }

          day++;
        }
      }

      calendarHTML += "</tr>";
    }

    calendarHTML += `
        </tbody>
      </table>
    `;

    container.innerHTML = calendarHTML;
  });
}

function previousMonth() {
  currentMonth--;
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
}

function nextMonth() {
  currentMonth++;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
}

const currentDate = new Date();
currentYear = currentDate.getFullYear();
currentMonth = currentDate.getMonth() + 1;
generateCalendar(currentYear, currentMonth);

document.getElementById('prev-month').addEventListener('click', previousMonth);
document.getElementById('next-month').addEventListener('click', nextMonth);