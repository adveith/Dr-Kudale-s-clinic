const submitButton = document.querySelector('form button');

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  alert('Your message has been sent!');
});