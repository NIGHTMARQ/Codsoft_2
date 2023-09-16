const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); // Import the database connection

router.get('/reg', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, hashedPassword, email], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error registering user');
    } else {
      res.redirect('/users/login');
    }
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error logging in');
    } else if (results.length === 0) {
      res.status(401).send('User not found');
    } else {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        req.session.user = { username: username};
        res.redirect('/dashboard');
      } else {
        res.status(401).send('Incorrect password');
      }
    }
  });
});



module.exports = router;
