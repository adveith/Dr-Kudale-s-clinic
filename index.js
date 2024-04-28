const express = require('express');
const path = require('path');
// const mysql = require('mysql');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const db = require('./db/conn.js'); 
const app = express();


// --------------------Middlewares and View Engine Setup -------------------

// Body parsing middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up views directory and view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('An error occurred:', err);
    res.status(500).send('Internal Server Error');
});
// -------------------APIS----------------------

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

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, results, fields) => {
      if (error) {
        console.error('Error executing MySQL query:', error);
        res.status(500).send('Error executing MySQL query');
        return;
      }
      res.json(results); // Assuming you want to send the query results as JSON
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

app.post('/users', (req, res) => {
    console.log(req.body);
    const { name, email, phone, password, date,time } = req.body;
    db.query(
      'INSERT INTO users (name, email, phone, password, appointment_time) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, password, date+" "+time],
      (error, results) => {
        if (error) {
          console.error('Error creating user:', error);
        //   res.status(500).json({ error: 'Error creating user' });
          return;
        }
        console.log("Data Submitted Successfully...")
        res.render('Contactss', { message: 'User created successfully', id: results.insertId });
      }
    );
  });




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
