let currentYear, currentMonth;
let popup;

function generateCalendar(year, month) {
  const container = document.getElementById('calendar-container');
  const date = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayIndex = date.getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  chrome.storage.local.get(['taskArrays'], function(result) {
    const taskArrays = result.taskArrays || {};

    // Object to store task count per day
    const taskCountPerDay = {};

    // Loop through all task arrays and count tasks for each day
    for (const [listId, taskArray] of Object.entries(taskArrays)) {
      for (const task of taskArray) {
        const dueDate = new Date(task.description.split(" due: ")[1]); // Extract the due date from the task description
        const dueDay = dueDate.getDate(); // Get the day from the Date object

        // Add the task to the taskCountPerDay object
        if (dueDate.getFullYear() === year && dueDate.getMonth() === month - 1) {
          const dayCount = taskCountPerDay[dueDay] || 0;
          taskCountPerDay[dueDay] = dayCount + 1;
        }
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

    // initializes the day counter
    let day = 1;

    //loops thru 6 rows to generate calendar dates
    for (let i = 0; i < 6; i++) {
      calendarHTML += "<tr>";

      // loops thru 7 columns(days of the week)
      for (let j = 0; j < 7; j++) {
        // If it's the first row and the current column index is less than the index of the first day of the month,
        // add empty cells until reaching the first day of the month
        if (i === 0 && j < firstDayIndex) {
          calendarHTML += "<td></td>";
        } else if (day > daysInMonth) {
          // If the day counter exceeds the total number of days in the month, exit the loop
          break;
        } else {
          // Otherwise, create a date object for the current day
          const currentDate = new Date(year, month - 1, day);
          const today = new Date();

          let dayHTML = day.toString();

          // Add task count for the day, if any
          const taskCount = taskCountPerDay[day] || 0;
          if (taskCount > 0) {
            dayHTML += ` (${taskCount})`;
          }

          // Check if the current date is today's date
          if (currentDate.toDateString() === today.toDateString()) {
            // If it's today's date, add a cell with the "today" class for styling
            calendarHTML += `<td class="today">${dayHTML}</td>`;
          } else {
            // If it's not today's date, add a cell with the day number
            calendarHTML += `<td>${dayHTML}</td>`;
          }

          day++;
        }
      }

      //close row
      calendarHTML += "</tr>";
    }

    calendarHTML += `
        </tbody>
      </table>
    `;

    container.innerHTML = calendarHTML;

    //adds event listeners for dates
    const dateCell = document.querySelectorAll('.date-cell'); 
    dateCell.forEach(cell => { 
      cell.addEventListener('click', function(){ 
        const clickedDate = this.dataset.date; 
        popupFunction(clickedDate, taskArrays) 
      });
    });
  });
}

// pop up window function that shows tasks due on clicked date
function popupFunction(date, taskArrays){ 
  const dateTasks = []; 
  
  //loops thru all task arrays and find tasks that are due on clicked date 
  for(const[listId, taskArray] of Object.entries(taskArrays)) { 
    for(const task of taskArray){ 
      const dueDate = new Date(task.description.split("due: ") [1]); //gets due date from task description
      if(dueDate.toDateString()=== date){ 
        const taskWODate = task.description.split(" due: ")[0]; //removes due date from task description
        dateTasks.push(taskWODate); 
      }
    }
  }

  // reset the pop-up window each click of the date
  if(popup && !popup.closed){ 
    popup.close(); 
  }
  popup = window.open('', 'Tasks Due', 'width= 400, height = 300'); 
  popup.document.write(`
    <html> 
      <head> 
        <title> Tasks Due on ${date} </title> 
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
          } 
          h2{ 
            margin-top: 0; 
          }
          ul{ 
            list-style-type: none; 
            padding: 0;
          }
          li{ 
            margin-bottom: 5px; 
          }
        </style>
        </head> 
        <body> 
          <h2> Tasks Due on ${date} </h2>
          <ul>
  `);

  if(dateTasks.length === 0){ 
    popup.document.write('<li> No Tasks Due </li>'); 
  } else{ 
    dateTasks.forEach(task => {
      popup.document.write(`<li>${task}</li>`);
    }); 
  }

  popup.document.write(`
        </ul> 
      </body> 
    </html>
  `);

}
// Function to navigate to previous month
function previousMonth() {
  currentMonth--;
  if (currentMonth < 1) {
    currentMonth = 12;
    currentYear--;
  }
  generateCalendar(currentYear, currentMonth);
}

// Function to navigate to next month
function nextMonth() {
  currentMonth++;
  if (currentMonth > 12) {
    currentMonth = 1;
    currentYear++;
  }
  generateCalendar(currentYear, currentMonth);
}

// Call the function with the current year and month
const currentDate = new Date();
currentYear = currentDate.getFullYear();
currentMonth = currentDate.getMonth() + 1;
generateCalendar(currentYear, currentMonth);
// Attach event listeners to the navigation buttons
document.getElementById('prev-month').addEventListener('click', previousMonth);
document.getElementById('next-month').addEventListener('click', nextMonth);