const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { processForm } = require('./src/process_form');

const app = express();

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Define route to render contact us page
app.get('/contact-us', (req, res) => {
    res.render('contact_us');
});

// Handle form submission
app.post('/submit-contact-form', (req, res) => {
    const formData = req.body;

    processForm(formData)
        .then(() => {
            res.send('Form submitted successfully!');
        })
        .catch(error => {
            res.status(500).send('Error submitting form: ' + error);
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
