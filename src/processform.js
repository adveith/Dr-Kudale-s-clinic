const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_database_user',
    password: 'your_database_password',
    database: 'your_database_name'
});

function processForm(formData) {
    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
        return Promise.reject('Please fill out all fields.');
    }

    // Insert form data into database
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO contact_form SET ?', formData, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    processForm
};
