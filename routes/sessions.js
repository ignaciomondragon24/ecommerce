const express = require('express');
const router = express.Router();
const User = require('../dao/models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport.config');

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const newUser = new User({ first_name, last_name, email, age, password });
    await newUser.save();
    res.status(201).send('Usuario registrado');
  } catch (err) {
    res.status(400).send('Error al registrar usuario');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Credenciales incorrectas');
    }
    const token = jwt.sign({ id: user._id }, 'nacho2004', { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true }).send('Login exitoso');
  } catch (err) {
    res.status(400).send('Error al iniciar sesión');
  }
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(req.user);
});

module.exports = router;