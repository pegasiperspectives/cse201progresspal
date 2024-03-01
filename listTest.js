
let counter1 = 1;
console.log("list " + counter1)


document.getElementById("listButton").addEventListener("click", function() {
var newElement = document.createElement("p");
newElement.textContent = "Element: " + counter1;
newElement.id = "element" + counter1;
newElement.style.display = "inline-block";
var newButton = document.createElement("button");
newButton.textContent = "Completed!";
newButton.id = "button" + counter1;
newButton.style.display = "inline-block";


newButton.addEventListener("click", function() {
    // Remove the corresponding paragraph and button elements
    newElement.parentNode.removeChild(newElement);
    newButton.parentNode.removeChild(newButton);
});

// Append the new element and the new button to the list
var newDiv = document.createElement("div");
newDiv.appendChild(newButton);
newDiv.appendChild(newElement);

// Append the new div to the list
var list = document.getElementById("listTest");
list.appendChild(newDiv);

counter1++;  // Increment counter
});

