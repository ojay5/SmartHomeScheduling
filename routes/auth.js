const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const path = require('path');

// ===================== SIGNUP =====================
router.post('/signup', async (req, res) => {
  const { username, email, password, confirm_password, role } = req.body;

  if (!username || !email || !password || !confirm_password || !role) {
    return res.status(400).send('All fields are required');
  }

  if (password !== confirm_password) {
    return res.status(400).send('Passwords do not match');
  }

  try {
    const existingUser = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) return reject(err);
        resolve(result[0]);
      });
    });

    if (existingUser) {
      return res.status(400).send('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });

    res.redirect('/success');

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).send('Server error');
  }
});

// GET: Success page
router.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/success.html'));
});

// ===================== LOGIN =====================
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send('Incorrect password');
    }

    // If login is successful
    res.redirect('/dashboard');
  });
});

// GET: Dashboard page
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

module.exports = router;
