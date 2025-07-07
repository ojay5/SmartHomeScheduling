const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',         // Leave empty if you didn't set a password in XAMPP
  database: 'smart home scheduling'  // Replace with your actual database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL Database');
  }
});

module.exports = db;
