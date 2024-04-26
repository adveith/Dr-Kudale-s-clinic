const express = require('express');
const path = require('path');
const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

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

// Define routes to render different pages
app.get('/about', (req, res) => {
    res.render('AboutDoctors');
});

app.get('/about/doctor1', (req, res) => {
    res.render('DrMaheshKudale');
});

app.get('/about/doctor2', (req, res) => {
    res.render('DrSheetalKudale');
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

app.get('/Homepage', (req, res) => {
    res.render('Homepage');
});

app.get('/AboutDoctors', (req, res) => {
    res.render('AboutDoctors');
});

// Handle form submission
app.post('/submit-form', [
    // Validate and sanitize form fields
    body('name').notEmpty().trim().escape(),
    body('phone').isMobilePhone(),
    body('email').isEmail().normalizeEmail(),
    body('message').notEmpty().trim().escape()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract form data
    const formData = req.body;
    const { name, phone, email, message } = formData;

    // Sanitize form data
    const sanitizedMessage = sanitizeHtml(message);

    // Insert sanitized data into the database
    const sql = 'INSERT INTO contact_submissions (name, phone, email, message) VALUES (?, ?, ?, ?)';
    const values = [name, phone, email, sanitizedMessage];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error inserting data into MySQL:', error);
            next(error);
            return;
        }
        console.log('Data inserted into MySQL:', results);
        res.send('Form submitted successfully!');
    });
});

// Define route to display contact submissions
app.get('/contact-submissions', (req, res) => {
    // Query to fetch all contact submissions from the database
    const sql = 'SELECT * FROM contact_submissions';

    // Execute the query
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching data from MySQL:', error);
            res.status(500).send('Error fetching data from database');
            return;
        }

        // Render the Contactss.ejs view and pass the retrieved data as context
        res.render('Contactss', { submissions: results });
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
