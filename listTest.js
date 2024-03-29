// This is the JavaScript file that makes a to-do list.

// Creates an array filled with the description of the tasks
// it will be updated later if there is something stored.
let taskArray = [];


// Keeps track of number of tasks generated. It will be incremented by one
// every time the "Add task" button is clicked. This is called "counter1" because,
// incrementTest.js already has a variable named "counter" and I don't want there
// to be any problems.
let counter1;

// Creates what is essentially a dictionary that takes the unique id of an element
// and it outputs the due date of that element.
let dueDates = {};


window.onload = function() {
    // Creates a variable called list that is connected to the div on the index page with the id = "listTest"
    var list = document.getElementById("listTest");


    // Checks to see if taskArray and counter1 are in the local storage
    // (they will be if the user has generated a task)
    // Also loads the due date array.
    chrome.storage.local.get(['taskArray', 'counter1', 'dueDates'], function(result) {
        taskArray = result.taskArray || [];
        counter1 = result.counter1 || 1;
        dueDates = result.dueDates || {};

        // if there are any tasks stored
        if (result.taskArray !== undefined) {


            // This loop takes every element in the task array and adds
            // it to the page.
            for (let i = 0; i < taskArray.length; i++) {
                // Creates a new button, paragraph tag, and div
                let newDiv = document.createElement("div");
                let newElement = document.createElement("p");
                let newButton = document.createElement("button");


                // Sets the style to inline block so they show up next to each other
                newElement.style.display = "inline-block";
                newButton.style.display = "inline-block";


                // Sets the text of the paragraph tag to the stored value in task array
                newElement.textContent = taskArray[i].text;
                // Stores the ID in the newElement
                newElement.id = taskArray[i].id;


                // Makes the button say "Completed!"
                newButton.textContent = "Completed!";

                // Creates a paragraph element for the due date of a task
                // it displays the date next to the task description
                var dueDateElement = document.createElement("p");
                dueDateElement.textContent = " || Due: " + dueDates[newElement.id]
                dueDateElement.style.display = "inline-block";


                // Adds the button and paragraph to the div
                newDiv.appendChild(newButton);
                newDiv.appendChild(newElement);
                newDiv.appendChild(dueDateElement);


                // Makes it so if a button is clicked it finds the corresponding element of the
                // task array and deletes it. Also deletes the div from the page. Also deletes the
                // corresponding due date from the dictionary.
                newButton.addEventListener("click", function() {

                    // Deletes the dictionary entry for the given task id
                    delete dueDates[newElement.id];

                    // Save the updated due dates in local storage
                    chrome.storage.local.set({ dueDates: dueDates }, function() {
                        console.log('Due dates updated');
                    });

                    // removes the node where the task id matches
                    newDiv.parentNode.removeChild(newDiv);
                    let index = taskArray.findIndex(task => task.id === parseInt(newElement.id));
                    if (index !== -1) {
                        taskArray.splice(index, 1);
                    }

                    chrome.storage.local.set({ taskArray: taskArray }, function() {
                        console.log('Task Array updated');
                    });
                });
                // adds the div into the list
                list.appendChild(newDiv);
            }
        }
    });
};



var list = document.getElementById("listTest");


// This code removes the default text in the user input box on the main page.
// When you click on the text field, "Add task here!" disappears.
var textField1 = document.getElementById("description");
textField1.onfocus = function() {
    if(this.value === 'Add task here!') {
        this.value = '';
    }
}


// Creates a date object for today.
let today = new Date();

// Creates variables for the 3 date text fields on the main page.
var dayTextField = document.getElementById("day");
var monthTextField = document.getElementById("month");
var yearTextField = document.getElementById("year");

// Makes the default values for each of the three text fields todays
// day, month, and year
day.value = today.getDate();
month.value = today.getMonth() + 1;
year.value = today.getFullYear();


// for the 3 text fields, makes it so when you click on them and their values
// match todays values, they disappear
dayTextField.onfocus = function() {
    if(this.value == today.getDate()) {
        this.value = '';
    }
}

monthTextField.onfocus = function() {
    if(this.value == (today.getMonth() + 1)) {
        this.value = '';
    }
}

yearTextField.onfocus = function() {
    if(this.value == today.getFullYear()) {
        this.value = '';
    }
}


// This code runs every time the "Add task" button is clicked
// It generates a new to do list item every time the button is clicked.
document.getElementById("listButton").addEventListener("click", function() {


    // creates variables for each of the 3 text fields on the main page
    var dayTextField = document.getElementById("day");
    var monthTextField = document.getElementById("month");
    var yearTextField = document.getElementById("year");

    // saves each of the values of the text field to a variable and tries
    // to cast then to an number
    var dueDay = Number(dayTextField.value);
    var dueMonth = Number(monthTextField.value);
    var dueYear = Number(yearTextField.value);

    // Resets the default values of each text field to todays values.
    day.value = today.getDate();
    month.value = today.getMonth() + 1;
    year.value = today.getFullYear();

    // Creates a boolean check to see if any of the date objects are not numbers
    var allValidInputsDate = (!isNaN(dueDay)) && (!isNaN(dueMonth)) && (!isNaN(dueYear));

    // makes the due date default to today (this will only occur if one of the due times is NaN)
    var dueDateObj = today;

    // if none of them are NaN, build a date object with the users inputs
    if (allValidInputsDate) {
        dueDateObj = new Date(dueYear, dueMonth - 1, dueDay);
    }



    // Creates a new text field object based on the contents of the index page text field.
    // The value variable contains the text the user enters (or "Enter task here!" if they
    // don't enter anything). Finally, it resets the value of the text field back to "Add task
    // here!"
    var textField = document.getElementById("description");
    var value = textField.value;
    textField.value = "Add task here!";


    // Creates a new paragraph tag variable. Sets changes the value of the paragraph tag to what the user put
    // in the text field. Sets style.display to "inline-block" so the button and paragraph tag will
    // show up next to each other.
    var newElement = document.createElement("p");
    newElement.id = counter1; // Stores the ID in the newElement
    newElement.textContent = "Task: " + value;
    newElement.style.display = "inline-block";


    // Creates a new button variable. The text that appears on the button says "Completed!". The style.display
    // to "inline-block" so the button and paragraph tag will show up next to each other.
    var newButton = document.createElement("button");
    newButton.textContent = "Completed!";
    newButton.style.display = "inline-block";


    // Adds an event listener to the newly generated button variable. When the button is clicked, it will delete
    // the itself and its corresponding paragraph tag. (In the code, parentNode describes the div that is created
    // in the next code block). Also deletes the tasks from local storage. Also deletes the due date from local
    // storage
    newButton.addEventListener("click", function() {
        delete dueDates[newElement.id];
        chrome.storage.local.set({ dueDates: dueDates }, function() {
            console.log('Due dates updated');
        });
        newDiv.parentNode.removeChild(newDiv);
        let index = taskArray.findIndex(task => task.id === parseInt(newElement.id));
        if (index !== -1) {
            taskArray.splice(index, 1);
        }

        chrome.storage.local.set({ taskArray: taskArray }, function() {
            console.log('Task Array updated');
        });
    });

    // the key of the new element id is linked to the string form of the date
    dueDates[newElement.id] = dueDateObj.toDateString();

    // updates the due dates to include the new value
    chrome.storage.local.set({ dueDates: dueDates }, function() {
        console.log('Due dates updated');
    });

    // creates a new paragraph element that appears new to the task
    // and displays the due date
    var dueDateElement = document.createElement("p");
    dueDateElement.textContent = " || Due: " + dueDates[newElement.id];
    dueDateElement.style.display = "inline-block";

    // Append the new paragraphs and the new button to the list to a div. The button will be displayed first,
    // and the paragraphs containing the task text and due date will be shown next to it.
    var newDiv = document.createElement("div");
    newDiv.appendChild(newButton);
    newDiv.appendChild(newElement);
    newDiv.appendChild(dueDateElement);


    // Pushes the new task to the array of tasks. also updates the value of counter1 in storage
    taskArray.push({ id: counter1, text: newElement.textContent });
    chrome.storage.local.set({ taskArray: taskArray, counter1: counter1 + 1 }, function() {
        console.log('Task Array and counter1 updated');
    });
    

    // We now add the div containing the button paragraph to list, that way it appears on the new web page.
    list.appendChild(newDiv);

    // Increments the total task counter
    counter1++;
});