var numOfLists = 0; //keeps track of the number of lists
let listArray = []; //holds the lists
let inputValues = {}; //holds the title input
let listToggles = {}; //holds the state of the toggled lists
let taskArrays = {}; //holds the taskArrays
let listColors = {};
let wholePageSettings = document.getElementById("topSettings");
const modal = document.createElement("div");
const settingBtn = document.getElementById("overallSettings");
const topRow = document.getElementById("topmostRow");
modal.id = "main-modal";
modal.classList.add("modal");
modal.classList.add("hidden");
document.body.appendChild(modal);
const colorTheme = document.createElement("input");
colorTheme.type = "color";
colorTheme.id = "color-picker-all";
colorTheme.style.display = "block";
colorTheme.style.margin = "20px";

modal.appendChild(colorTheme);
const tabContainer = document.getElementById("tab-container");
tabContainer.style.display = "inline-block";
let puppyArray = ["puppy.png", "puppywsunglasses.png", "puppywastrohelmet.png"];
let birdArray = ["bird.png", "birdwsunglasses.png", "birdwastrohelmet.png"];


window.onload = function () { //runs when the page loads

    const newListButton = document.getElementById("generate new list"); //clickable button to generate a new list
    newListButton.addEventListener("click", createNewList); //creates a new list by calling the method
    wholePageSettings.addEventListener("click", createAllSettings);

    chrome.storage.local.get(['listArray', 'inputValues', 'listToggle', 'taskArrays', 'listColors'], function (result) { //pulls values from storage
        console.log('Data retrieved:', result);

        listArray = result.listArray || []; //sets up the listArray
        inputValues = result.inputValues || {}; //sets up the title input array
        listToggles = result.listToggle || {}; //sets up the toggle state of lists array
        taskArrays = result.taskArrays || {}; //sets up the array of taskArrays
        listColors = result.listColors || {};
        numOfLists = 0; // Set numOfLists to the value retrieved from storage or 0 if not available
        console.log("number of lists: " + numOfLists);
        console.log("list array length: " + listArray.length);
        listArray.forEach((item) => {
            createNewList();
            console.log("creating list # " + numOfLists);
        });
    });
}


function createAllSettings() {
    event.stopPropagation();
    modal.classList.toggle("hidden");

    colorTheme.addEventListener('input', function (event) {
        // Get the selected color value
        const selectedColor = event.target.value;

        document.body.style.backgroundColor = selectedColor;
        tabContainer.style.backgroundColor = selectedColor;
        /*  chrome.storage.local.set({ 'listColors': listColors }, function () {
              console.log('Color saved for list ' + numOfLists + ':', selectedColor);
          }); */
    });

    // Function to handle click outside modal
    function clickOutsideModal(event) {
        if (!modal.contains(event.target) && event.target !== wholePageSettings) {
            modal.classList.add("hidden");
        }
    }

    // Add event listener for mouseover on the settings row
    topRow.addEventListener('mouseover', function () {
        // Show the setting button
        settingBtn.classList.remove('hidden');
        settingBtn.style.textAlign = "center";
    });


    // Add event listener for mouseout on the settings row
    topRow.addEventListener('mouseout', function () {
        // Hide the setting button
        settingBtn.classList.add('hidden');
    });

    document.body.addEventListener("click", clickOutsideModal);
}

//create the list no matter what but put everything besides the button in a conditional?
//but what about the event listener problem?

function createNewList() {
    numOfLists++; //increments the number of lists

    const numOfTabs = listArray.length;
    const tabWidth = 1 / numOfTabs * 635;
    const color = listColors[numOfLists] || "#C4A577";

    const tabButton = document.createElement("button"); //creates a tab button for the list
    tabButton.className = "tab";
    tabButton.id = "tab" + numOfLists;
    tabButton.textContent = "List " + numOfLists;
    tabButton.style.fontFamily = "listTitle";
    tabButton.style.fontSize = "20px";
    tabButton.style.height = "60px";
    tabButton.style.width = "" + tabWidth + "px";
    tabButton.style.backgroundColor = color;
    tabButton.style.borderRadius = "10px 10px 0px 0px";
    tabButton.style.border = "none";

    if (numOfLists == 1) {
        tabButton.style.marginLeft = "65px";
    } else {
        tabButton.style.marginLeft = "0px";
    }

    tabContainer.appendChild(tabButton); //adds the tab button to the tab container

    const listContainer = document.createElement("div"); //creates the list container
    listContainer.id = "list-container-" + numOfLists; //gives the list container an id

    const isToggled = listToggles["list" + numOfLists];
    const tableClass = isToggled ? "" : "hidden";

    /* if (isToggled == true) {
         tabButton.style.filter = "brightness(90%)";
     } */

    const list = document.createElement("div"); //creates a list div for the list currently on
    list.classList.add("list"); //adds the class 'list' to the div element ^
    list.id = "list" + numOfLists; //sets the id based on which list currently on
    const listID = list.id;

    const table = document.createElement("table"); //creates the table for this list
    table.className = tableClass;
    table.id = "table-" + numOfLists;
    table.style.backgroundColor = color;

    const settingsRow = document.createElement("tr"); //creates the row for the setting for this list
    settingsRow.id = "settings-row-" + numOfLists; //gives setting row id based on current list 
    settingsRow.style.textAlign = "center"; //makes sure this list's setting row is centered


    const settingsCell = document.createElement("td"); //creates the column for the setting button
    settingsCell.colSpan = "3"; //makes sure the setting button spans the width of the extension
    settingsCell.style.height = "70px"; //makes sure the setting button is the right height


    const settingBtnDiv = document.createElement("div"); //creates a div for the setting button
    settingBtnDiv.id = "setting-btn-" + numOfLists; //sets the id for the setting button based on list currently on


    const settingBtnImage = document.createElement("input"); //creates the actual button for the settings
    settingBtnImage.type = "image"; //clarifies this button is from an image
    settingBtnImage.height = "60"; //height of the setting icon button
    settingBtnImage.width = "80"; //width of the setting button
    settingBtnImage.src = "download.png"; //link for the setting icon for button


    settingBtnDiv.appendChild(settingBtnImage); //puts the image in the setting div
    settingsCell.appendChild(settingBtnDiv); //puts the setting div in the setting cell
    settingsRow.appendChild(settingsCell); //puts the setting cell in the top row of the table

    const titleRow = document.createElement("tr"); //creates the next row for this table
    titleRow.id = "title-row-" + numOfLists; //gives this row an id based on current list

    const titleCell = document.createElement("td"); //creates the column for the title for this table
    titleCell.colSpan = "3"; //makes sure title spans across width of the page
    titleCell.style.textAlign = "center"; //aligns title center

    const toggleTitleBtn = document.createElement("input"); //clarifies the title button is an image input
    toggleTitleBtn.type = "image"; //clarifies the title button is an image input
    toggleTitleBtn.height = "30"; //title icon height
    toggleTitleBtn.width = "40"; //title icon width
    toggleTitleBtn.src = "titlebutton.png"; //link for the title icon for button
    toggleTitleBtn.id = "toggle-title-btn-" + numOfLists; //id for the title icon

    const titleInput = document.createElement("input"); //creates the title input box
    titleInput.type = "text"; //clarifies the input is text
    titleInput.style.backgroundColor = color; //sets the background color of the input box
    titleInput.id = "title-input-" + numOfLists; //gives title input id based on current list
    titleInput.classList.add("titleStyle"); //makes sure title is styled correctly from style.css

    const storedInputValue = inputValues['list' + numOfLists] || "enter title here"; //retrieves stored title value on reload
    titleInput.placeholder = storedInputValue; //makes the placeholder for title input whatever was previously entered

    const taskRow = document.createElement("tr"); //creates the row in the table for the tasks

    const taskCell1 = document.createElement("td"); //creates the td for the task
    taskCell1.width = "2%"; //sets the width of the task cell


    const taskImgDiv = document.createElement("div"); //creates a div for the add task button
    const taskImg = document.createElement("img"); //clarifies the add task button is an image
    taskImg.src = "addtask.png"; //link for add task image
    taskImg.style.height = "20px"; //add task height
    taskImg.style.width = "20px"; //add task width
    taskImg.style.paddingLeft = "20px"; //gives the add task button correct padding
    taskImg.id = "plus-" + numOfLists; //gives add task button id based on list number
    taskImg.classList.add("plus"); //makes sure the css class is applied to the add task button from style.css
    taskImgDiv.appendChild(taskImg); //adds add task to the div
    taskCell1.appendChild(taskImgDiv); //adds add task button to the the first cell in this row

    // Task management functions...
    function toggleTextField() {
        // Toggle the visibility of the image and text field
        if (taskImg.style.display !== "none") {
            textField.style.display = "inline-block";
            textField.focus();
        } else {
            textField.style.display = "none";
        }
    }


    taskImg.addEventListener("click", toggleTextField);


    const taskCell2 = document.createElement("td"); //creates column for the task user input
    taskCell2.width = "53%"; //makes sure the input takes up the right width of the screen
    const textField = document.createElement("input"); //sets up the text input
    textField.type = "text"; //clarifies the input from user is text
    textField.style.backgroundColor = color; //gives the input box the correct background color
    textField.id = "description-" + numOfLists; //gives the description for this task the correct id
    textField.classList.add("description"); //adds correct class to task id
    textField.name = "description"; //sets the name of the textfield
    taskCell2.appendChild(textField); //adds the input box to the second cell in this row


    const taskCell3 = document.createElement("td"); //creates a column for where tasks will be stored
    taskCell3.width = "45%"; //makes sure tasks take up the correct width on the page
    const listTestDiv = document.createElement("div"); //creates a div for this cell
    listTestDiv.id = "listTest-" + numOfLists; //gives the correct id
    listTestDiv.style.marginRight = "20px"; //styles the task correctly
    taskCell3.appendChild(listTestDiv); //adds task div to the correct cell in this row


    taskRow.appendChild(taskCell1); //adds add task button to first cell in table row
    taskRow.appendChild(taskCell2); //adds input box to second cell in table row
    taskRow.appendChild(taskCell3); //adds task list to third cell in table row


    titleCell.appendChild(toggleTitleBtn); //adds the toggleTitleBtn to the title cell
    titleCell.appendChild(titleInput); //adds the title input to the title cell
    titleRow.appendChild(titleCell); //adds the title cell to the title row
    table.appendChild(settingsRow); //adds the settings row to the table
    table.appendChild(titleRow); //adds the title row to the table
    table.appendChild(taskRow); //adds the task row to the table
    list.appendChild(table); //adds the table to the list

    // Add event listener for mouseover on the settings row
    settingsRow.addEventListener('mouseover', function () {
        // Show the setting button
        settingBtnDiv.classList.remove('hidden');
        settingBtnDiv.style.textAlign = "center";
    });


    // Add event listener for mouseout on the settings row
    settingsRow.addEventListener('mouseout', function () {
        // Hide the setting button
        settingBtnDiv.classList.add('hidden');
    });


    // Add event listener for mouseover on the title row
    titleRow.addEventListener('mouseover', function () {
        // Show the toggle title button
        toggleTitleBtn.classList.remove('hidden');
    });


    // Add event listener for mouseout on the title row
    titleRow.addEventListener('mouseout', function () {
        // Hide the toggle title button
        toggleTitleBtn.classList.add('hidden');
    });

    // Add event listener for mouseout on the title row
    toggleTitleBtn.addEventListener('click', function () {
        // Hide the toggle title button
        titleInput.classList.toggle('hidden');
    });

    listContainer.appendChild(list); //adds the list to the list container

    document.body.appendChild(listContainer); //adds the list container to the document body

    addTabButtonEventListener(tabButton, numOfLists, table, taskCell3); //checks if the add list button is clicked

    addInputFieldEventListener(titleInput, numOfLists); //checks if the title input box is altered

    addTaskInputEventListener(textField, numOfLists, taskCell3);

    addSettingButtonEventListener(numOfLists, listID);

    // Push the list data to the listArray

    const isExisting = listArray.some(item => item.id === list.id);
    if (!isExisting) {
        listArray.push({ id: list.id });
    }

    // Save the updated listArray to Chrome storage
    chrome.storage.local.set({ listArray: listArray }, function () {
        console.log('listArray saved to Chrome storage');
    });

}

function addTabButtonEventListener(tabButton, numOfLists, table, taskCell3) {
    tabButton.addEventListener('click', function () {
        const table = document.getElementById("list" + numOfLists).querySelector('table');
        table.classList.toggle("hidden");
        console.log('Button clicked');

        // Update listToggles with toggle state
        listToggles['list' + numOfLists] = !table.classList.contains("hidden");

        // Save updated listToggles object to Chrome storage
        chrome.storage.local.set({ listToggle: listToggles }, function () {
            console.log('Toggle state saved for ' + numOfLists);
        });
    });

    // Populate task containers based on the current state of taskArrays
    if (!table.classList.contains("hidden")) {
        const taskArray = taskArrays['list' + numOfLists] || [];
        taskArray.forEach(function (task) {
            const taskContainer = document.createElement("div"); //creates a task container div
            taskContainer.className = "task-container"; //gives the task container a className
            taskContainer.style.display = "flex"; //makes sure the task container is styled correctly

            //taskContainer.style.display = "flex"; //makes sure the task container is styled correctly
            //taskContainer.style.flexDirection = "column"; //makes sure the task container is styled correctly
            const taskID = task.id; //generates a unique task id

            const taskParagraph = document.createElement("p"); //creates a p element to store task
            var checkLink = task.description;
            checkLink = detectAndMakeClickable(checkLink);

            function detectAndMakeClickable(checkLink) {
                var urlRegex = /((?:https?|ftp):\/\/[^\s]+)/g;
                return checkLink.replace(urlRegex, function (url) {
                    var link = document.createElement('a');
                    link.href = url;
                    link.textContent = url;
                    link.className = 'clickable-link';
                    link.target = '_blank'; // Open link in a new tab
                    return link.outerHTML;
                });
            }

            taskParagraph.innerHTML = checkLink; //adds task as a paragraph

            const completeImage = document.createElement("img"); //creates an image to appear next to task (the done button)
            completeImage.src = 'bird.png'; //gives the button the correct link
            completeImage.alt = 'Your task is not done yet!'; //alt text
            completeImage.height = 50; //sets height of done button
            completeImage.width = 60; //sets width of done button
            completeImage.style.paddingLeft = "50px"; //makes sure done button is styled correctly

            const hoverImagePath = birdArray[1]; //the link for the image to appear on hover

            completeImage.addEventListener('mouseover', function () { //checks if image is currently being hovered on
                completeImage.src = hoverImagePath; //changes the done task button accordingly
            });

            completeImage.addEventListener('mouseout', function () { //checks for when the user hovers off the button
                completeImage.src = 'bird.png'; //sets the button back to its original image
            });

            completeImage.addEventListener('click', function () { //checks if the done button is clicked
                taskContainer.remove(); //removes the container ?
                const index = taskArrays['list' + numOfLists].findIndex(task => task.id === taskID); //gets the index of the current task
                if (index !== -1) { //makes sure the index is valid
                    taskArrays['list' + numOfLists].splice(index, 1); //shifts the array ?

                    chrome.storage.local.set({ taskArrays: taskArrays }, function () {
                        console.log('Task removed for list ' + numOfLists);
                    });
                }
            });

            taskContainer.appendChild(taskParagraph); //adds the task paragraph to the task container
            taskContainer.appendChild(completeImage); //adds the done button to the task container
            taskCell3.appendChild(taskContainer); //adds the task to the correct table cell
        });
    }
}

function addInputFieldEventListener(titleInput, numOfLists) {
    titleInput.addEventListener('input', function (event) {
        // Retrieve the value of the input box when the event is triggered
        const inputValue = event.target.value;

        // Update inputValues object with the new value
        inputValues['list' + numOfLists] = inputValue;

        // Save the updated inputValues object to Chrome storage
        chrome.storage.local.set({ inputValues: inputValues }, function () {
            console.log('Input value saved for list ' + numOfLists + ':', inputValue);
        });
    });
}

function addTaskInputEventListener(textField, numOfLists, taskCell3) {
    textField.addEventListener("keypress", function (event) {
        if (event.keyCode === 13) { // Check if Enter key is pressed
            const value = textField.value.trim(); //retrieves the text from the texfield
            if (value !== '') { //checks that a task has been entered into the input box
                const taskID = Date.now(); //generates a unique task id
                const taskDescription = "• " + value; //sets the task description to the text entered by user

                const taskContainer = document.createElement("div"); //creates a task container div
                taskContainer.className = "task-container"; //gives the task container a className
                taskContainer.style.display = "flex"; //makes sure the task container is styled correctly

                const taskParagraph = document.createElement("p"); //creates a p element to store task
                var checkLink = taskDescription;
                checkLink = detectAndMakeClickable(checkLink);

                function detectAndMakeClickable(checkLink) {
                    var urlRegex = /((?:https?|ftp):\/\/[^\s]+)/g;
                    return checkLink.replace(urlRegex, function (url) {
                        var link = document.createElement('a');
                        link.href = url;
                        link.textContent = url;
                        link.className = 'clickable-link';
                        link.target = '_blank'; // Open link in a new tab
                        return link.outerHTML;
                    });
                }

                taskParagraph.innerHTML = checkLink; //adds task as a paragraph

                const completeImage = document.createElement("img"); //creates an image to appear next to task (the done button)
                completeImage.src = 'bird.png'; //gives the button the correct link
                completeImage.alt = 'Your task is not done yet!'; //alt text
                completeImage.height = 50; //sets height of done button
                completeImage.width = 60; //sets width of done button
                completeImage.style.paddingLeft = "50px"; //makes sure done button is styled correctly

                const hoverImagePath = birdArray[1]; //the link for the image to appear on hover

                completeImage.addEventListener('mouseover', function () { //checks if image is currently being hovered on
                    completeImage.src = hoverImagePath; //changes the done task button accordingly
                });

                completeImage.addEventListener('mouseout', function () { //checks for when the user hovers off the button
                    completeImage.src = 'bird.png'; //sets the button back to its original image
                });

                completeImage.addEventListener('click', function () { //checks if the done button is clicked
                    taskContainer.remove(); //removes the container ?
                    const index = taskArrays['list' + numOfLists].findIndex(task => task.id === taskID); //gets the index of the current task
                    if (index !== -1) { //makes sure the index is valid
                        taskArrays['list' + numOfLists].splice(index, 1); //shifts the array ?

                        chrome.storage.local.set({ taskArrays: taskArrays }, function () {
                            console.log('Task removed for list ' + numOfLists);
                        });
                    }
                });

                taskContainer.appendChild(taskParagraph); //adds the task paragraph to the task container
                taskContainer.appendChild(completeImage); //adds the done button to the task container

                taskCell3.appendChild(taskContainer); //adds the task to the correct table cell

                taskArrays['list' + numOfLists] = taskArrays['list' + numOfLists] || [];
                taskArrays['list' + numOfLists].push({ id: taskID, description: taskDescription }); //push the tasks from this list into the array

                chrome.storage.local.set({ taskArrays: taskArrays }, function () { //makes sure the task array data is saved in chrome
                    console.log('Task added for list ' + numOfLists); //statement to see if the above line works ^
                });

                textField.value = ''; //clear the text field after a task is entered
            }
        }
    });
}

function addSettingButtonEventListener(numOfLists, listID) {
    const listContainer = document.getElementById("list-container-" + numOfLists);
    const tabBtn = document.getElementById("tab" + numOfLists);
    const listTable = document.getElementById("table-" + numOfLists);
    const listTask = document.getElementById("description-" + numOfLists);
    const listTitle = document.getElementById("title-input-" + numOfLists);
    const modalTrigger = document.getElementById("setting-btn-" + numOfLists);
    const modal = document.createElement("div");
    modal.id = "modal-" + numOfLists;
    modal.classList.add("modal");
    modal.classList.add("hidden");
    const colorTheme = document.createElement("input");
    colorTheme.type = "color";
    colorTheme.id = "color-picker-" + numOfLists;
    colorTheme.style.display = "block";
    colorTheme.style.margin = "20px";

    const deleteBtn = document.createElement("button"); //add a delete button to the modal
    deleteBtn.style.height = "70px";
    deleteBtn.style.width = "200px";
    deleteBtn.style.display = "block";
    deleteBtn.id = "delete-" + numOfLists;
    deleteBtn.style.margin = "20px";
    deleteBtn.textContent = "delete list " + numOfLists + ". PERMANENT!";

    deleteBtn.addEventListener("click", function () {
        listContainer.remove();
        tabBtn.remove();
        console.log("before: " + listArray);
        console.log("this is the length of the array: " + listArray.length);

        const index = listArray.findIndex(item => item.id === listID); //gets the index of the current list?
        if (index != -1) {
            console.log("after: " + listArray);

            /*  if (index != listArray.length - 1) { // Check if the deleted list is not the first list
  
                  for (let k = listArray.length; k > index; k--) {
                      moveListSettings(k, k + 1);
                  }
                  // Remove the last list since it's now empty
                  const lastIndex = listArray.length - 1;
  
                  // Remove the last list from listArray
                  listArray.splice(lastIndex, 1);
              } else { */
            listArray.splice(index, 1);
            //}


            chrome.storage.local.set({ listArray: listArray }, function () {
                console.log('list ' + numOfLists + ' removed');
                console.log("this is the length of the array: " + listArray.length);
                console.log(listArray);
            });
        }
    });

    modal.appendChild(colorTheme);
    modal.appendChild(deleteBtn);

    document.body.appendChild(modal);
    colorTheme.addEventListener('input', function (event) {
        // Get the selected color value
        const selectedColor = event.target.value;
        listTable.style.backgroundColor = selectedColor;
        listTask.style.backgroundColor = selectedColor;
        listTitle.style.backgroundColor = selectedColor;
        tabBtn.style.backgroundColor = selectedColor;
        listColors[numOfLists] = selectedColor;
        chrome.storage.local.set({ 'listColors': listColors }, function () {
            console.log('Color saved for list ' + numOfLists + ':', selectedColor);
        });
    });


    // Add event listener to the modal trigger
    modalTrigger.addEventListener("click", function () {
        event.stopPropagation();
        modal.classList.toggle("hidden");
    });

    // Function to handle click outside modal
    function clickOutsideModal(event) {
        if (!modal.contains(event.target) && event.target !== modalTrigger) {
            modal.classList.add("hidden");
        }
    }

    document.body.addEventListener("click", clickOutsideModal);

}

/* function moveListSettings(toListIndex, fromListIndex) {
    // Move settings from fromListIndex to toListIndex
    inputValues['list' + toListIndex] = inputValues['list' + fromListIndex];
    listToggles['list' + toListIndex] = listToggles['list' + fromListIndex];
    const moveColor = listToggles['list' + fromListIndex]

    const tabBtn = document.getElementById("tab" + fromListIndex);
    const listTable = document.getElementById("table-" + fromListIndex);
    const listTask = document.getElementById("description-" + fromListIndex);
    const listTitle = document.getElementById("title-input-" + fromListIndex);

    listTable.style.backgroundColor = "blue";
    listTask.style.backgroundColor = "blue";
    listTitle.style.backgroundColor = "blue";
    tabBtn.style.backgroundColor = "blue";


    // Save the updated settings to Chrome storage
    chrome.storage.local.set({
        inputValues: inputValues,
        listToggles: listToggles,
        listColors: listColors
    }, function () {
        console.log('Settings moved from list ' + fromListIndex + ' to list ' + toListIndex);
    });
} //this isn't working */