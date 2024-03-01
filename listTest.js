// This is the JavaScript file that makes a to-do list.
// There is still work to be done, as the list is not kept in storage yet.

// Keeps track of number of tasks generated. It will be incremented by one
// every time the "Add task" button is clicked. This is called "counter1" because,
// incrementTest.js already has a variable named "counter" and I don't want there
// to be any problems.
let counter1 = 1;

// This code removes the default text in the user input box on the main page.
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
    newElement.textContent = " " + value;
    newElement.style.display = "inline-block";

    // Creates a new button variable. The text that appears on the button says "Completed!". The style.display
    // to "inline-block" so the button and paragraph tag will show up next to each other.
    var newButton = document.createElement("button");
    newButton.textContent = "Completed!";
    newButton.style.display = "inline-block";

    // Adds an event listener to the newly generated button variable. When the button is clicked, it will delete
    // the itself and its corresponding paragraph tag. (In the code, parentNode describes the div that is created
    // in the next code block)
    newButton.addEventListener("click", function() {
        newElement.parentNode.removeChild(newElement);
        newButton.parentNode.removeChild(newButton);
    });

    // Append the new paragraph and the new button to the list to a div. The button will be displayed first,
    // and the paragraph containing the task text will be shown next to it.
    var newDiv = document.createElement("div");
    newDiv.appendChild(newButton);
    newDiv.appendChild(newElement);

    // Creates a variable called list that is connected to the div on the index page with the id = "listTest"
    // We now add the div containing the button paragraph to list, that way it appears on the new web page.
    var list = document.getElementById("listTest");
    list.appendChild(newDiv);

    // Increments the total task counter
    counter1++;
});

