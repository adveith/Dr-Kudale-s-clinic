const express = require('express');
const path = require('path');
const mysql = require('mysql');

const app = express();

// Body parsing middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create MySQL database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'clinic_user',
    password: 'password',
    database: 'clinic'
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        process.exit(1); // Exit the application if unable to connect to the database
    } else {
        console.log('Connected to MySQL database');
    }
});

// Define route to render contact us page


app.get('/about', (req, res) => {
    res.render('AboutDoctors');
});

app.get('/about/doctor1', (req, res) => {
    res.render('DrMaheshKudale');
});

app.get('/about/doctor2', (req, res) => {
    res.render('DrMaheshKudale');
});

app.get('/service', (req, res) => {
    res.render('Service');
});

app.get('/contact-us', (req, res) => {
    res.render('Contactss');
});

// Define route to render homepage

app.get('/', (req, res) => {
    res.render('Homepage');
});

// Handle form submission
app.post('/submit-form', (req, res) => {
    const formData = req.body;
    const { name, phone, email, message } = formData; // Destructure form data

    const sql = 'INSERT INTO contact_submissions (name, phone, email, message) VALUES (?, ?, ?, ?)';
    const values = [name, phone, email, message];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error inserting data into MySQL:', error);
            res.status(500).send('Error submitting form');
        } else {
            console.log('Data inserted into MySQL:', results);
            res.send('Form submitted successfully!');
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).send('Internal Server Error');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
