const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'travel_booking'
});

connection.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      console.log(results);
    }
    
    // Close the connection
    //connection.end();
  });

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});

module.exports = connection;
