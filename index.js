    const express = require('express');
    const path = require('path');
    const app = express();

    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, 'public')));

    // Set up views directory and view engine
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');
    // app.set('view engine', 'html');
    app.use(express.static(path.join(__dirname, 'views')));

    // Define route to render contact us page
    app.get('/contact-us', (req, res) => {
        res.render('Contactss');
    });


    app.get('/', (req, res) => {
        res.render('Homepage');
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
