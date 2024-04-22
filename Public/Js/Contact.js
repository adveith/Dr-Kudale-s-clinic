const currentUrl = window.location.href;

// Get all navigation buttons
const navButtons = document.querySelectorAll('.nav-button');

// Loop through each button
navButtons.forEach(button => {
    // If the button's href matches the current URL
    if (button.href === currentUrl) {
        // Add the 'active' class to highlight it
        button.classList.add('active');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('form button');

    submitButton.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Your message has been sent!');
    });
});