// This is the JavaScript file that makes a to-do list.
// There is still work to be done, as the list is not kept in storage yet.

// Creates an array filled with the description of the tasks
// it will be updated later if there is something stored.
let taskArray = []


window.onload = function() {
    // Creates a variable called list that is connected to the div on the index page with the id = "listTest"
    var list = document.getElementById("listTest");


    // Checks to see if taskArray is in the local storage
    // (it will be if the user has generated a task)
    chrome.storage.local.get(['taskArray'], function(result) {
        // if there are any tasks stored
        if (result.taskArray !== undefined) {
            // it updates the taskArray array to the one in storage
            taskArray = result.taskArray;

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
                newElement.textContent = taskArray[i];

                // Makes the button say "Completed!"
                newButton.textContent = "Completed!";

                // Adds the button and paragraph to the div (idk I need to do this
                // but it works so I'm keeping it)
                newDiv.appendChild(newButton);
                newDiv.appendChild(newElement);

                // Makes it so if a button is clicked it finds the corresponding element of the
                // task array and deletes it. Also deletes the div from the page.
                // Also I'm pretty sure this doesn't work super well if two tasks have the same text
                // but thats a later problem.
                newButton.addEventListener("click", function() {
                    newDiv.parentNode.removeChild(newDiv);
                    let index = taskArray.indexOf(newElement.textContent);
                    if (index !== -1) {
                        taskArray.splice(index, 1);
                    }

                    chrome.storage.local.set({taskArray: taskArray}, function() {
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


// Keeps track of number of tasks generated. It will be incremented by one
// every time the "Add task" button is clicked. This is called "counter1" because,
// incrementTest.js already has a variable named "counter" and I don't want there
// to be any problems.


let counter1 = 1;


// This code removes the default text in the user input box on the main page.
// When you click on the text field, "Add task here!" disappears.
var textField1 = document.getElementById("description");
textField1.onfocus = function() {
    if(this.value === 'Add task here!') {
        this.value = '';
    }
}




// This code runs every time the "Add task" button is clicked
// It generates a new to do list item every time the button is clicked.
document.getElementById("listButton").addEventListener("click", function() {
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
    newElement.textContent = "Task: " + value;
    newElement.style.display = "inline-block";



    // Creates a new button variable. The text that appears on the button says "Completed!". The style.display
    // to "inline-block" so the button and paragraph tag will show up next to each other.
    var newButton = document.createElement("button");
    newButton.textContent = "Completed!";
    newButton.style.display = "inline-block";



    // Adds an event listener to the newly generated button variable. When the button is clicked, it will delete
    // the itself and its corresponding paragraph tag. (In the code, parentNode describes the div that is created
    // in the next code block). Also deletes the tasks from local storage
    newButton.addEventListener("click", function() {
        newDiv.parentNode.removeChild(newDiv);
        let index = taskArray.indexOf(newElement.textContent);
        if (index !== -1) {
            taskArray.splice(index, 1);
        }

        chrome.storage.local.set({taskArray: taskArray}, function() {
            console.log('Task Array updated');
        });
    });



    // Append the new paragraph and the new button to the list to a div. The button will be displayed first,
    // and the paragraph containing the task text will be shown next to it.
    var newDiv = document.createElement("div");
    newDiv.id = "div" + counter1;
    newDiv.appendChild(newButton);
    newDiv.appendChild(newElement);

    // Pushes the new task to the array of tasks
    taskArray.push(newElement.textContent)
    chrome.storage.local.set({taskArray: taskArray}, function() {
        console.log('Task Array updated');
    });



    // We now add the div containing the button paragraph to list, that way it appears on the new web page.
    list.appendChild(newDiv);



    // Increments the total task counter
    counter1++;
});
