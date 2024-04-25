//default holders & trackers
var numOfLists = 0; //keeps track of the number of lists
let listArray = []; //holds the lists
let inputValues = {}; //holds the title input
let listToggles = {}; //holds the state of the toggled lists
let taskArrays = {}; //holds the taskArrays
let listColors = {}; //holds the colors for each background of each list
let dueDates = {}; //contains the due dates for the tasks

//creating the settings button & correlating modal for customizin
const modal = document.createElement("div"); //creates the settings modal
const settingBtn = document.getElementById("overallSettings"); //identifies the setting button
const topRow = document.getElementById("topSettings"); //access the nav row
modal.id = "main-modal"; //gives an id to the modal
modal.classList.add("modal"); //adds the modal class to the modal
modal.classList.add("hidden"); //adds the hidden class to the modal for toggling
document.body.appendChild(modal); //adds the modal to the body

//makes sure the color picker is present on the modal
const colorTheme = document.createElement("input"); //gets the color from user for background
colorTheme.type = "color"; //specifies input will be a color
colorTheme.id = "color-picker-all"; //makes sure it functions as a color picker
colorTheme.style.display = "block"; //displays as a block
colorTheme.style.margin = "20px"; //width of the color picker button
var bodyColor = "black"; //default body color
modal.appendChild(colorTheme); //adds color picker to the modal

//accesses nav bar
const tabContainer = document.getElementById("tab-container"); //refers to the nav bar
tabContainer.style.display = "inline-block"; //styles nav bar to be inline-block

//done with task arrays & set-up
let puppyArray = ["puppy.png", "puppywsunglasses.png", "puppywastrohelmet.PNG"]; //array of puppy complete button images
let birdArray = ["bird.png", "birdwsunglasses.png", "birdwastrohelmet.png"]; //array of bird complete button images
let currentArrayForAnimal = []; //refers to the current animal/thing the user has chosen
let completeButtonSrc = ""; //stand in for what will later be the image url
let completeButtonDel = ""; //stand in for what will later be the done image url
let completeButtons = ["puppy", "bird"]; //is the array that gives the user options for what they want
let completeAccessories = ["sunglasses", "astronaut helmet"]; //is the array that gives the user options for their done button

window.onload = function () { //runs when the page loads

    //sets up setting & create list buttons
    const newListButton = document.getElementById("generate new list"); //clickable button to generate a new list
    newListButton.addEventListener("click", createNewList); //creates a new list when the button is clicked
    topRow.addEventListener("click", createAllSettings); //makes sure the user can access settings when button is clicked

    //retrieves all data from storage
    chrome.storage.local.get(['listArray', 'inputValues', 'listToggle', 'taskArrays', 'listColors', 'bodyColor', 'completeButtonSrc', 'completeButtonDel', 'dueDates'], function (result) { //pulls values from storage
        console.log('Data retrieved:', result); //to ensure that in inspect mode you can see if the correct data is present

        //housekeeping & setting up defaults
        listArray = result.listArray || [];
        inputValues = result.inputValues || {};
        listToggles = result.listToggle || {};
        taskArrays = result.taskArrays || {};
        listColors = result.listColors || {};
        dueDates = result.dueDates || {};

        console.log(taskArrays);

        // Reset numOfLists to the current length of listArray
        numOfLists = listArray.length;

        bodyColor = result.bodyColor; //sets the background color of the extension
        completeButtonSrc = result.completeButtonSrc || "bird.png"; //sets up the complete button
        completeButtonDel = result.completeButtonDel || "birdwsunglasses.png"; //sets up the hover & done for complete button

        //background color styling for different overall elements on the page
        document.body.style.backgroundColor = bodyColor; //makes the background of the extension the specific color
        tabContainer.style.backgroundColor = bodyColor; //makes sure the background behind the list tabs is the specific color
        topRow.style.backgroundColor = bodyColor; //makes sure the nav row background is the specific color

        //setting up the lists
        numOfLists = 0; // Set numOfLists to the value retrieved from storage or 0 if not available
        console.log("number of lists: " + numOfLists); //to ensure that in inspect mode you can see how many lists there are
        console.log("list array length: " + listArray.length); //to ensure that in inspect mode you can see how long the list array is
        listArray.forEach((item) => { //goes through each list in storage
            createNewList(); //recreates each list from storage
            console.log("creating list # " + numOfLists); //to ensure that in inspect mode you can see if the lists are getting created correctly
        });
    });

    //full screen option
    const fullScreenButton = document.createElement('button'); //creates the full screen button
    fullScreenButton.textContent = "make the extension take up your screen!"; //controls what text appears on the full screen button
    modal.append(fullScreenButton); //puts full screen button on settings modal that controls entire page

    //triggers when full screen button is clicked
    fullScreenButton.addEventListener("click", function () { //senses for click
        chrome.tabs.create({ url: "index.html" }); //opens up page in a new tab so that it takes up more of the screen
    });

    // Create a select element for complete button
    const selectElement = document.createElement('select'); //creates a select element to control the animal for complete button
    selectElement.id = 'completeBtn'; // Set the id attribute for complete button
    selectElement.name = 'complete button'; // Set the name attribute for complete button
    selectElement.style.marginBottom = "10px"; //styling for complete button
    selectElement.style.display = "block"; //styling for complete button

    // Create and append options
    completeButtons.forEach(button => { //goes through each option in the array
        const optionElement = document.createElement('option'); //specifies that it's an option
        optionElement.value = button.toLowerCase(); // Set the value attribute
        optionElement.textContent = button; // Set the visible text
        selectElement.appendChild(optionElement); //append the option to the select element
        modal.appendChild(selectElement); //add the selected complete button to the settings modal for the page
    });

    //make it so that the select list for complete button responds to an option clicked
    selectElement.addEventListener('change', function (event) { //event listener for change
        console.log('Selected button:', event.target.value); //outputs what is clicked to console
        if (selectElement.selectedIndex == 0) { //if user selects first option on the complete buttons
            currentArrayForAnimal = puppyArray; //this means that the user selected "puppy"
        }
        else if (selectElement.selectedIndex == 1) { //if user selections second option on the complete button
            currentArrayForAnimal = birdArray; //this means that the user selected "bird"
        }
    });

    // Create a select element for complete button hover
    const selectElement2 = document.createElement('select'); //creates a select element to control the hover for complete button
    selectElement2.id = 'accessoriesbtn'; // Set the id attribute for hover for complete button
    selectElement2.name = 'accessories button'; // Set the name attribute for hover for complete button
    selectElement2.style.marginBottom = "10px"; //styling for hover complete button
    selectElement2.style.display = "block"; //styling for hover complete button

    // Create and append options
    completeAccessories.forEach(button => { //goes through each option in the array
        const optionElement2 = document.createElement('option'); //specifies that it's an option
        optionElement2.value = button.toLowerCase(); // Set the value attribute
        optionElement2.textContent = button; // Set the visible text
        selectElement2.appendChild(optionElement2); //append the option to the select element
        modal.appendChild(selectElement2); //add the selected complete hover button to the settings modal for the page
    });

    //make it so that the select list for complete button hover responds to an option clicked
    selectElement2.addEventListener('change', function (event) { //event listener for change
        console.log('Selected button:', event.target.value); //outputs what is clicked to console
        completeButtonSrc = currentArrayForAnimal[0]; //picks the first complete button image in the animal array w/o accessories
        completeButtonDel = currentArrayForAnimal[selectElement2.selectedIndex + 1]; //picks the complete button as the option the user clicked
        console.log(completeButtonSrc + ", " + completeButtonDel); //outputs the user's clicked choices

        chrome.storage.local.get(['listArray', 'inputValues', 'listToggle', 'taskArrays', 'listColors', 'bodyColor', 'dueDates'], function (result) {
            const storageData = {
                listArray: result.listArray || [],
                inputValues: result.inputValues || {},
                listToggle: result.listToggle || {},
                taskArrays: result.taskArrays || {},
                listColors: result.listColors || {},
                bodyColor: result.bodyColor,
                completeButtonSrc: completeButtonSrc,
                completeButtonDel: completeButtonDel,
                dueDates: result.dueDates || {}
            };

            chrome.storage.local.set(storageData, function () {
                console.log('Storage data updated:', storageData);
            });
        });
    });
}

//creates the settings at the top of the page
function createAllSettings() { //functioin to create overall settings
    event.stopPropagation(); //honestly I'm not sure why this is put here
    modal.classList.toggle("hidden"); //toggles settings on and off (currently doesn't work)

    //accesses color input box in the overall settings modal
    colorTheme.addEventListener('input', function (event) { //adds the event listener
        bodyColor = event.target.value; //gets the selected color from user
        document.body.style.backgroundColor = bodyColor; //makes it so that the document body is user's picked color
        tabContainer.style.backgroundColor = bodyColor; //makes it so that the tab container is user's picked color
        topRow.style.backgroundColor = bodyColor; //makes it so that the overall settings background is user's picked color
        chrome.storage.local.set({ 'bodyColor': bodyColor }, function () { //saves bodycolor to settings
            console.log('Color saved for body', bodyColor); //outputs whether this was successful
        });
    });

    // Function to handle click outside modal
    function clickOutsideModal(event) { //event listener
        if (!modal.contains(event.target) && event.target !== topRow) { //if user clicks outside modal and doesn't click on the top row
            modal.classList.add("hidden"); //hide the settings modal the user is done with it
        }
    }

    document.body.addEventListener("click", clickOutsideModal); //add event listener to the body so that the page can detect when user wants out of the settings
}

//creates a new list
function createNewList() {
    numOfLists++; //increments the number of lists

    const numOfTabs = listArray.length; //sets this variable to the number of lists
    const tabWidth = 1 / numOfTabs * 635; //sets tab with of the lists so that they take up a certain amount of space based on how many there are
    const color = listColors[numOfLists] || "#C4A577"; //sets color for the list based on what's in storage or default color here

    const tabButton = document.createElement("button"); //creates a tab button for the list
    tabButton.className = "tab"; //gives the tab button a classname
    tabButton.id = "tab" + numOfLists; //gives the tabButton an id based on which list it is
    tabButton.textContent = "List " + numOfLists; //text that appears basede on which list it is
    tabButton.style.fontFamily = "listTitle"; //styling
    tabButton.style.fontSize = "20px"; //styling
    tabButton.style.height = "60px"; //styling
    tabButton.style.width = "" + tabWidth + "px"; //styling
    tabButton.style.backgroundColor = color; //sets background color to what's picked by user
    tabButton.style.borderRadius = "10px 10px 0px 0px"; //styling
    tabButton.style.border = "none"; //styling

    if (numOfLists == 1) { //if it's the first list, it gets slightly different styling
        tabButton.style.marginLeft = "65px"; //styling
    } else {
        tabButton.style.marginLeft = "0px"; //styling
    }

    tabContainer.appendChild(tabButton); //adds the tab button to the tab container

    const listContainer = document.createElement("div"); //creates the list container
    listContainer.id = "list-container-" + numOfLists; //gives the list container an id

    const isToggled = listToggles["list" + numOfLists]; //accesses toggle class
    const tableClass = isToggled ? "" : "hidden"; //switches toggle state

    const list = document.createElement("div"); //creates a list div for the list currently on
    list.classList.add("list"); //adds the class 'list' to the div element ^
    list.id = "list" + numOfLists; //sets the id based on which list currently on
    const listID = list.id; //creates a list id variable

    const table = document.createElement("table"); //creates the table for this list
    table.className = tableClass; //gives table a classname
    table.id = "table-" + numOfLists; //gives table an id
    table.style.backgroundColor = color; //styling

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

    //toggles whether the text field is displayed
    function toggleTextField() {
        if (taskImg.style.display !== "none") { //if thing exists
            textField.style.display = "inline-block"; //styling
            textField.focus(); //if user is in the text box for inputting a task
        } else {
            textField.style.display = "none"; //if thing exists make it not exist
        }
    }

    taskImg.addEventListener("click", toggleTextField); //makes it so that page senses when the image is clicked and then triggers event ^

    const taskCell2 = document.createElement("td"); //creates column for the task user input
    taskCell2.width = "53%"; //makes sure the input takes up the right width of the screen
    const textField = document.createElement("input"); //sets up the text input
    textField.type = "text"; //clarifies the input from user is text
    textField.style.backgroundColor = color; //gives the input box the correct background color
    textField.id = "description-" + numOfLists; //gives the description for this task the correct id
    textField.classList.add("description"); //adds correct class to task id
    textField.name = "description"; //sets the name of the textfield
    taskCell2.appendChild(textField); //adds the input box to the second cell in this row
    const lineBreak4 = document.createElement("br"); //styling
    taskCell2.appendChild(lineBreak4); //append styling

    const dueDate = document.createElement("p"); //creates paragraph for date input instructions
    dueDate.textContent = "enter due date:"; //instructions for user
    taskCell2.appendChild(dueDate); //add instructions to page
    let today = new Date(); //create a date object

    const dayInput = document.createElement("input"); //input box for day
    dayInput.type = "text"; //sets the type to text
    dayInput.id = "day" + numOfLists; //gives day input an id
    dayInput.value = today.getDate(); //gets today's date: day
    taskCell2.appendChild(dayInput); //appends to document
    const lineBreak = document.createElement("br"); //styling
    taskCell2.appendChild(lineBreak); //appends styling

    const monthInput = document.createElement("input"); //input box for month
    monthInput.type = "text"; //sets the type to text
    monthInput.id = "month" + numOfLists; //gives month input an id
    monthInput.value = today.getMonth() + 1; //gets today's date: month
    taskCell2.appendChild(monthInput); //appends to document
    const lineBreak3 = document.createElement("br"); //stylingg
    taskCell2.appendChild(lineBreak3); //appends styling

    const yearInput = document.createElement("input"); //input for year
    yearInput.type = "text"; //sets the type to text
    yearInput.id = "year" + numOfLists; //gives year input an id
    yearInput.value = today.getFullYear(); //get's today's date: year
    taskCell2.appendChild(yearInput); //append to document
    const lineBreak2 = document.createElement("br"); //styling
    taskCell2.appendChild(lineBreak2); //append styling

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

    // Add event listener for mouseover on the settings row for each list
    settingsRow.addEventListener('mouseover', function () { //event listener on hover
        settingBtnDiv.classList.remove('hidden'); //on hover, show setting button for list
        settingBtnDiv.style.textAlign = "center"; //styling
    });

    // Add event listener for mouseout on the settings row for each list
    settingsRow.addEventListener('mouseout', function () { //event listener for exit hover
        settingBtnDiv.classList.add('hidden'); //on exit hover, hide settings button
    });

    // Add event listener for mouseover on the title row for each list
    titleRow.addEventListener('mouseover', function () { //event listener on hover
        toggleTitleBtn.classList.remove('hidden'); //on hover, show title button
    });

    // Add event listener for mouseout on the title row
    titleRow.addEventListener('mouseout', function () { //event listener for exit hover
        toggleTitleBtn.classList.add('hidden'); //on exit hover, hide title button
    });

    // Add event listener for click on the title row
    toggleTitleBtn.addEventListener('click', function () { //event listener for click on the title row button
        titleInput.classList.toggle('hidden'); //on click, hide the title row text box
    });

    listContainer.appendChild(list); //adds the list to the list container

    document.body.appendChild(listContainer); //adds the list container to the document body

    addTabButtonEventListener(tabButton, numOfLists, table, taskCell3); //checks if the add list button is clicked

    addInputFieldEventListener(titleInput, numOfLists); //checks if the title input box is altered

    addTaskInputEventListener(textField, numOfLists, taskCell3, today); //checks if the plus button is clicked

    addSettingButtonEventListener(numOfLists, listID, textField); //checks if the setting button on the list is clicked

    // Push the list data to the listArray
    const isExisting = listArray.some(item => item.id === list.id); //if list already exists
    if (!isExisting) { //as long as the list doesn't exist yet
        listArray.push({ id: list.id }); //push list to the array
    }

    // Save the updated listArray to Chrome storage
    chrome.storage.local.set({ listArray: listArray }, function () { //storage
        console.log('listArray saved to Chrome storage'); //console output for whether storage was successful
    });

} //end of create list function

//event listener that's set up in create list
function addTabButtonEventListener(tabButton, numOfLists, table, taskCell3) { //contains parameters of necessary parts of list to use
    tabButton.addEventListener('click', function () { //runs when the tab button of this particular list is clicked
        const table = document.getElementById("list" + numOfLists).querySelector('table'); //retrieves table for this list
        table.classList.toggle("hidden"); //changes toggle state of list to show/hide tasks based on what it was on in the previous load
        console.log('Button clicked'); //outputs to console whether the code registered that the tab list button was clicked

        listToggles['list' + numOfLists] = !table.classList.contains("hidden"); // Update listToggles for this list with its toggle state

        // Save updated listToggles object to Chrome storage
        chrome.storage.local.set({ listToggle: listToggles }, function () { //storage
            console.log('Toggle state saved for ' + numOfLists); //outputs whether storage was successful
        });
    });

    // Populate task containers based on the current state of taskArrays
    if (!table.classList.contains("hidden")) { //if table is currently shown
        const taskArray = taskArrays['list' + numOfLists] || []; //accesses the correct taskArray
        taskArray.forEach(function (task) { //for each task in the array
            const taskContainer = document.createElement("div"); //creates a task container div
            taskContainer.className = "task-container"; //gives the task container a className
            taskContainer.style.display = "flex"; //makes sure the task container is styled correctly
            const taskID = task.id; //generates a unique task id
            const taskParagraph = document.createElement("p"); //creates a p element to store task
            var checkLink = task.description; //accesses task description
            checkLink = detectAndMakeClickable(checkLink); //creates a variable to check

            function detectAndMakeClickable(checkLink) { //checks if the description user entered contains a link
                var urlRegex = /((?:https?|ftp):\/\/[^\s]+)/g; //honestly chat gpt helped me with this line, I think it helps determine link & formatting
                return checkLink.replace(urlRegex, function (url) { //if it is detected as a link
                    var link = document.createElement('a'); //create the link as a link element
                    link.href = url; //specifies it's a url
                    link.textContent = url; //specifies it's a url
                    link.className = 'clickable-link'; //gives it a class name
                    link.target = '_blank'; // Open link in a new tab
                    return link.outerHTML; //returns that it's a link
                });
            }

            taskParagraph.innerHTML = checkLink; //adds task as a paragraph
            const completeImage = document.createElement("img"); //creates an image to appear next to task (the done button)
            completeImage.src = "" + completeButtonSrc + ""; //gives the button the correct link
            completeImage.alt = 'Your task is not done yet!'; //alt text
            completeImage.height = 50; //sets height of done button
            completeImage.width = 60; //sets width of done button
            completeImage.style.paddingLeft = "50px"; //makes sure done button is styled correctly

            completeImage.addEventListener('mouseover', function () { //checks if image is currently being hovered on
                completeImage.src = "" + completeButtonDel + ""; //changes the done task button accordingly
            });

            completeImage.addEventListener('mouseout', function () { //checks for when the user hovers off the button
                completeImage.src = completeButtonSrc; //sets the button back to its original image
            });

            completeImage.addEventListener('click', function () { //checks if the done button is clicked
                taskContainer.remove(); //removes the task through its container
                const index = taskArrays['list' + numOfLists].findIndex(task => task.id === taskID); //gets the index of the current task
                if (index !== -1) { //makes sure the index is valid
                    taskArrays['list' + numOfLists].splice(index, 1); //shifts the array after removing the task
                    chrome.storage.local.set({ taskArrays: taskArrays }, function () { //updates storage for task
                        console.log('Task removed for list ' + numOfLists); //outputs to console whether storage was successful
                    });
                }
            });

            taskContainer.appendChild(taskParagraph); //adds the task paragraph to the task container
            taskContainer.appendChild(completeImage); //adds the done button to the task container
            taskCell3.appendChild(taskContainer); //adds the task to the correct table cell
        });
    }
}

//event listener that's set up in create list
function addInputFieldEventListener(titleInput, numOfLists) { //contains necessary parameters for parts of list to edit
    titleInput.addEventListener('input', function (event) { //checks if user is typing in title row
        const inputValue = event.target.value; // Retrieve the value of the input box when the event is triggered
        inputValues['list' + numOfLists] = inputValue; // Update inputValues object with the new value
        chrome.storage.local.set({ inputValues: inputValues }, function () { // Save the updated inputValues object to Chrome storage
            console.log('Input value saved for list ' + numOfLists + ':', inputValue); //outputs to console whether storage was successful
        });
    });
}

//event listener that's set up in create list
function addTaskInputEventListener(textField, numOfLists, taskCell3, today) { //contains necessary parameters for parts of list to edit
    textField.addEventListener("keypress", function (event) { //adds keypress listener to the task input text box
        if (event.keyCode === 13) { // Check if Enter key is pressed
            const value = textField.value.trim(); //retrieves the text from the texfield
            if (value !== '') { //checks that a task has been entered into the input box
                const taskID = Date.now(); //generates a unique task id
                var taskDescription = "• " + value; //sets the task description to the text entered by user

                const taskContainer = document.createElement("div"); //creates a task container div
                taskContainer.className = "task-container"; //gives the task container a className
                taskContainer.style.display = "flex"; //makes sure the task container is styled correctly

                const taskParagraph = document.createElement("p"); //creates a p element to store task
                var checkLink = taskDescription; //accesses the task description
                checkLink = detectAndMakeClickable(checkLink); //creates a variable to check

                function detectAndMakeClickable(checkLink) { //checks if the description user entered contains a link
                    var urlRegex = /((?:https?|ftp):\/\/[^\s]+)/g; //honestly chat gpt helped me with this line, I think it helps determine link & formatting
                    return checkLink.replace(urlRegex, function (url) { //if it is detected as a link
                        var link = document.createElement('a'); //create the link as a link element
                        link.href = url; //specifies it's a url
                        link.textContent = url; //specifies it's a url
                        link.className = 'clickable-link'; //gives it a class name
                        link.target = '_blank'; // Open link in a new tab
                        return link.outerHTML; //returns that it's a link
                    });
                }

                taskParagraph.innerHTML = checkLink; //adds task as a paragraph

                const completeImage = document.createElement("img"); //creates an image to appear next to task (the done button)
                completeImage.src = "" + completeButtonSrc + ""; //gives the button the correct link
                completeImage.alt = 'Your task is not done yet!'; //alt text
                completeImage.height = 50; //sets height of done button
                completeImage.width = 60; //sets width of done button
                completeImage.style.paddingLeft = "50px"; //makes sure done button is styled correctly

                completeImage.addEventListener('mouseover', function () { //checks if image is currently being hovered on
                    completeImage.src = "" + completeButtonDel + ""; //changes the done task button accordingly
                });

                completeImage.addEventListener('mouseout', function () { //checks for when the user hovers off the button
                    completeImage.src = completeButtonSrc; //sets the button back to its original image
                });

                completeImage.addEventListener('click', function () { //checks if the done button is clicked
                    taskContainer.remove(); //removes the task through its container
                    const index = taskArrays['list' + numOfLists].findIndex(task => task.id === taskID); //gets the index of the current task
                    if (index !== -1) { //makes sure the index is valid
                        taskArrays['list' + numOfLists].splice(index, 1); //shifts the array after removing the task
                        chrome.storage.local.set({ taskArrays: taskArrays }, function () { //updates storage for task
                            console.log('Task removed for list ' + numOfLists); //outputs to console whether storage was successful
                        });
                    }
                });

                dayInput = document.getElementById("day" + numOfLists); //gets the day for the task
                monthInput = document.getElementById("month" + numOfLists); //gets the month for the task
                yearInput = document.getElementById("year" + numOfLists); //gets the year for the task
                var dueDay = Number(dayInput.value); //converts day to number
                var dueMonth = Number(monthInput.value); //converts month to number
                var dueYear = Number(yearInput.value); //converts year to number
                console.log("date: " + dueMonth + " " + dueDay + " " + dueYear); //outputs to console whether the results of the date are accurate
                var allValidInputsDate = (!isNaN(dueDay)) && (!isNaN(dueMonth)) && (!isNaN(dueYear)); // Creates a boolean check to see if any of the date objects are not numbers
                var dueDateObj = today; // makes the due date default to today (this will only occur if one of the due times is NaN)

                if (allValidInputsDate) { // if none of them are NaN, build a date object with the users inputs
                    dueDateObj = new Date(dueYear, dueMonth - 1, dueDay); //creates a due date object
                }

                dueDates[textField.id] = dueDateObj.toDateString() || {}; // the key of the new element id is linked to the string form of the date

                // updates the due dates to include the new value
                chrome.storage.local.set({ dueDates: dueDates }, function () { //storage
                    console.log('Due dates updated: ' + dueDates[textField.id]); //outputs to console whether storage was successful
                });

                taskDescription += " due: " + dueDates[textField.id]; //add due date to task description
                taskParagraph.innerHTML = taskDescription; //adds due date to task description
                console.log("task description: " + taskDescription); //outputs to console whether task due date was added
                taskContainer.appendChild(taskParagraph); //adds the task paragraph to the task container
                const lineBreak5 = document.createElement("br"); //styling
                taskContainer.appendChild(lineBreak5); //styling
                taskContainer.appendChild(completeImage); //adds the done button to the task container
                taskCell3.appendChild(taskContainer); //adds the task to the correct table cell
                taskArrays['list' + numOfLists] = taskArrays['list' + numOfLists] || []; //updates task array
                taskArrays['list' + numOfLists].push({ id: taskID, description: taskDescription }); //push the tasks from this list into the array

                chrome.storage.local.set({ taskArrays: taskArrays }, function () { //makes sure the task array data is saved in chrome
                    console.log('Task added for list ' + numOfLists); //statement to see if the above line works ^
                });

                textField.value = ''; //clear the text field after a task is entered
            }
        }
    });
}

//event listener for the settings of each list
function addSettingButtonEventListener(numOfLists, listID, textField) { //parameters for necessary elements of list to edit
    const listContainer = document.getElementById("list-container-" + numOfLists); //accesses list container for this list
    const tabBtn = document.getElementById("tab" + numOfLists); //accesses the list tab button for this list
    const listTable = document.getElementById("table-" + numOfLists); //accesses the list table for this list
    const listTask = document.getElementById("description-" + numOfLists); //accesses the tasks of this list
    const listTitle = document.getElementById("title-input-" + numOfLists); //accesses the title input box for this list
    const modalTrigger = document.getElementById("setting-btn-" + numOfLists); //accesses setting button for this list
    const modal = document.createElement("div"); //creates a modal
    modal.id = "modal-" + numOfLists; //gives modal an id based on which list this is
    modal.classList.add("modal"); //add modal to class list
    modal.classList.add("hidden"); //hide emodal on default
    var colorPickerDiv = document.createElement('div');
    colorPickerDiv.classList.add('color-picker');
    colorPickerDiv.style.width = modal.width;
    const colorTheme = document.createElement("input"); //create color picker input
    colorTheme.type = "color"; //specify input is color
    colorTheme.id = "color-picker-" + numOfLists; //give color input an id
    colorTheme.style.display = "block"; //styling
    colorTheme.style.visibility = 'hidden'; // Hide the color input


    const deleteBtn = document.createElement("button"); //add a delete button to the modal
    deleteBtn.style.height = "70px"; //styling
    deleteBtn.style.width = "200px"; //styling
    deleteBtn.style.display = "block"; //styling
    deleteBtn.id = "delete-" + numOfLists; //gives button an id
    deleteBtn.style.margin = "20px"; //styling
    deleteBtn.textContent = "delete list " + numOfLists + ". PERMANENT!"; //text content for delete button

    //keep in mind that currently delete list only works correctly when the last list is deleted, not any before that, 
    //therefore the comments are a bit iffy
    deleteBtn.addEventListener("click", function () { //runs when button is clicked
        listContainer.remove(); //remove list
        tabBtn.remove(); //remove tab button for list
        console.log("before: " + listArray); //check state of list
        console.log("this is the length of the array: " + listArray.length); //check length of list

        const index = listArray.findIndex(item => item.id === listID); //gets the index of the current list
        if (index != 0) {
            moveListSettings(index);
        }
    });

    // Create a label for displaying text and styling
    var colorLabel = document.createElement('label');
    colorLabel.htmlFor = 'colorInput';
    colorLabel.textContent = 'Choose color + tab color for this list';
    colorLabel.fontSize = "30px";
    colorLabel.classList.add('color-label');

    // Append the input and label to the color picker div
    colorPickerDiv.appendChild(colorTheme);
    colorPickerDiv.appendChild(colorLabel);
    modal.appendChild(colorPickerDiv); //appends the color picker to the list's modal/settings
    modal.appendChild(deleteBtn); //appends the delete button to the list's modal/settings
    document.body.appendChild(modal); //appends the modal to the 

    colorLabel.addEventListener('click', function () {
        colorTheme.click(); // Trigger click event on hidden color input
    });

    //listens for when the color input is used
    colorTheme.addEventListener('input', function (event) {
        const selectedColor = event.target.value; // Get the selected color value
        listTable.style.backgroundColor = selectedColor; //set the list to this color
        listTask.style.backgroundColor = selectedColor; //set the list to this color
        listTitle.style.backgroundColor = selectedColor; //set the list to this color
        tabBtn.style.backgroundColor = selectedColor; //set the list to this color
        colorLabel.style.backgroundColor = selectedColor;
        listColors[numOfLists] = selectedColor; //updates the color for this list in the array
        chrome.storage.local.set({ 'listColors': listColors }, function () { //saves color of list to storage
            console.log('Color saved for list ' + numOfLists + ':', selectedColor); //outputs whether storage was successful
        });
    });

    // Add event listener to the modal trigger
    modalTrigger.addEventListener("click", function () { //listens for click
        event.stopPropagation(); //uh, I'm not sure
        modal.classList.toggle("hidden"); //toggles whether the modal is hidden or not based on if button is clicked
    });

    // Function to handle click outside modal
    function clickOutsideModal(event) {
        if (!modal.contains(event.target) && event.target !== modalTrigger) { //if user clicks on the page
            modal.classList.add("hidden"); //will close modal
        }
    }

    document.body.addEventListener("click", clickOutsideModal); //adds event listener to the page

}

// Function to handle the scroll event and makes navbar stay in place
function scrollFunction() {
    var navbar = document.getElementById("navbar");
    var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Check if the user is scrolling down
    if (currentScroll > 0) {
        navbar.classList.add("fixed-navbar");
    } else {
        navbar.classList.remove("fixed-navbar");
    }
}

// Attach the scroll event listener
window.addEventListener("scroll", scrollFunction);

function moveListSettings(fromListIndex) {
    // Remove the list from the inputValues and listToggles objects
    delete inputValues['list' + fromListIndex];
    delete listToggles['list' + fromListIndex];
    delete taskArrays['list' + fromListIndex];
    delete listColors[fromListIndex];
    delete dueDates['description-' + fromListIndex];

    // Shift down the remaining lists
    for (let i = fromListIndex + 1; i <= Object.keys(inputValues).length; i++) {
        inputValues['list' + (i - 1)] = inputValues['list' + i];
        listToggles['list' + (i - 1)] = listToggles['list' + i];
        taskArrays['list' + (i - 1)] = taskArrays['list' + i];
        listColors[(i - 1)] = listColors[i];
        dueDates['description-' + (i - 1)] = dueDates['description-' + i];

        const tabBtn = document.getElementById("tab" + i);
        const listTable = document.getElementById("table-" + i);
        const listTask = document.getElementById("description-" + i);
        const listTitle = document.getElementById("title-input-" + i);

        tabBtn.id = "tab" + (i - 1);
        tabBtn.textContent = "List " + (i - 1);
        listTable.id = "table-" + (i - 1);
        listTask.id = "description-" + (i - 1);
        listTitle.id = "title-input-" + (i - 1);
    }

    // Remove the last (now empty) list
    const lastIndex = Object.keys(inputValues).length;
    delete inputValues['list' + lastIndex];
    delete listToggles['list' + lastIndex];
    delete taskArrays['list' + lastIndex];
    delete listColors[lastIndex];
    delete dueDates['description-' + lastIndex];

    const lastTabBtn = document.getElementById("tab" + lastIndex);
    const lastListTable = document.getElementById("table-" + lastIndex);
    const lastListTask = document.getElementById("description-" + lastIndex);
    const lastListTitle = document.getElementById("title-input-" + lastIndex);

    lastTabBtn.parentNode.removeChild(lastTabBtn);
    lastListTable.parentNode.removeChild(lastListTable);
    lastListTask.parentNode.removeChild(lastListTask);
    lastListTitle.parentNode.removeChild(lastListTitle);

    // Update the numOfLists variable
    numOfLists--;

    // Save the updated settings to Chrome storage
    chrome.storage.local.set({
        inputValues: inputValues,
        listToggles: listToggles,
        taskArrays: taskArrays,
        listColors: listColors,
        dueDates: dueDates
    }, function () {
        console.log('List ' + fromListIndex + ' deleted and lists shifted down');
    });
}