/*This is the Javascript code that changes the background color
of the page that you are on for the navbar */
var navbarLinks = document.querySelectorAll('.navBarLink');

for (var i = 0; i < navbarLinks.length; i++) {
    if (navbarLinks[i].href == document.URL) {
        navbarLinks[i].classList.add('active');
    }
}