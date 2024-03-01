// This is the JavaScript file that contains the code for the paragraph that
// increases by one every time the button is clicked. The number of button
// clicks is stored in local storage for the user, so the number of button
// clicks is kept track of between sessions (even if the extension is closed).



// Creates a variable that keeps track of the number of clicks (defaults to zero)
let counter = 0;



// This code tries to access the number of clicks from local storage. If there is no
// stored number, no code runs and the default value of 0 for "counter" is kept. If there
// is a stored value, then the value of "counter" is change to that stored value.
chrome.storage.local.get(['counter'], function(result) {
    if (result.counter !== undefined) {
        counter = result.counter;
    }
});



// Creates an event listener that runs the function increment() every time the
// "Click to add to counter" button is clicked.
document.getElementById('clickTracker').addEventListener('click', increment);



// This function increases the counter by one, updates the paragraph tag that keeps track
// of the total number of clicks on the main page, then finally updates value in of the counter
// in local storage to the new value after the increase.
function increment() {
    // Increment the counter
    counter++;



    // Update the counter display
    document.getElementById("test").innerHTML = "Button has been clicked " + counter + " times.";



    // Save the new counter value to storage
    chrome.storage.local.set({counter: counter}, function() {
        console.log('Counter value is set to ' + counter);
    });
}
