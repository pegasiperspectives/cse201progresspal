const BUTTON = document.querySelector('button')
const DIV = document.querySelector('div')

// Toggle into and out of fullscreen function
const toggleFullscreen = () => {
    // Testing if screen is fullscreen or not
    if (document.fullscreenElement)
        // If true, we will exit fullscreen on button press
        document.exitFullscreen()
    else
        // If false, we will enter fullscreen on button press
        DIV.requestFullscreen()
}

document.getElementById('toggleFullscreen').addEventListener('click', toggleFullscreen)

const onChange = () => {
    DIV.className = document.fullscreenElement ? 'fullscreen' : ''
}

document.addEventListener('fullscreenchange', onChange)