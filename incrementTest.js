window.onload = function() {

    let counter = 0;

    // Try to load the counter value from storage
    chrome.storage.local.get(['counter'], function(result) {
        if (result.counter !== undefined) {
            counter = result.counter;
        }
    });

    document.getElementById('click').addEventListener('click', increment);

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

}