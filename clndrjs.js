let currentYear, currentMonth;
  
    function generateCalendar(year, month) {
      const container = document.getElementById('calendar-container');
      const date = new Date(year, month - 1, 1);
      const daysInMonth = new Date(year, month, 0).getDate();
      const firstDayIndex = date.getDay();
  
      const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
  
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
  
      let day = 1; // initializes the day counter 
  
      //loops thru 6 rows to generate calendar dates
      for (let i = 0; i < 6; i++) {
        calendarHTML += "<tr>"; // starts a new r in the calendar table 
  
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
            
            // Check if the current date is today's date
            if (currentDate.toDateString() === today.toDateString()) {
                // If it's today's date, add a cell with the "today" class for styling
              calendarHTML += `<td class="today">${day}</td>`;
            } else {
            // If it's not today's date, add a cell with the day number
              calendarHTML += `<td>${day}</td>`;
            }
  
            day++;
          }
        }
  
        calendarHTML += "</tr>"; //close row
      }
  
      calendarHTML += `  <!-- Close the table body and table -->
          </tbody>
        </table>
      `;
  
      container.innerHTML = calendarHTML;
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
  
    