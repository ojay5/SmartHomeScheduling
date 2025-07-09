const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// Handle signup POST
router.post('/signup', async (req, res) => {
  const { username, email, password, confirm_password, role } = req.body;

  if (password !== confirm_password) {
    return res.send('Passwords do not match');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send('Database error');
      }

      res.send('User registered successfully');
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    res.status(500).send('Internal error');
  }
});

module.exports = router;
