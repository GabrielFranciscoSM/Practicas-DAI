import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const router = express.Router();

const registerUser = async (name, email, password) => {
  try {
    const user = new User({ name, email, password });
    await user.save();
    console.log('User registered:', user);
    return user;
  } catch (error) {
    console.error('Registration failed:', error.message);
    throw error;
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  const isMatch = await user.isValidPassword(password);
  if (!isMatch) return null;
  return user;
};

// Para mostrar formulario de login              --> GET
router.get('/login', (req, res) => {
  res.render('login.html');
});

// Para recoger datos del formulario de login    --> POST
router.post('/login', async (req, res) => {
  const usr_email = req.body.usr_email;
  const usr_password = req.body.usr_password;

  try {
    const user = await loginUser(usr_email, usr_password);
    if (!user) {
      return res.status(401).render('login.html', { error: 'Usuario o contraseña inválidos' });
    }

    // ensure we have a secret available for signing
    const jwtSecret = process.env.SECRET_KEY || process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT secret is not configured. Set SECRET_KEY or JWT_SECRET in the environment.');
      // show a friendly message in the login form rather than exposing internal details
      return res.status(500).render('login.html', { error: 'Error de configuración del servidor. Inténtelo más tarde.' });
    }

    // crear token JWT
    let token;
    try {
      token = jwt.sign({ usuario: user.name, id: user._id, admin: user.admin }, jwtSecret, { expiresIn: '2h' });
    } catch (signErr) {
      console.error('JWT signing failed:', signErr.message || signErr);
      return res.status(500).render('login.html', { error: 'No se pudo crear la sesión. Inténtelo de nuevo.' });
    }

    // enviar cookie segura
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.IN === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Error en el login');
  }
});

// Registro
router.get('/registro', (req, res) => {        // --> GET
  res.render('registro.html');
});

router.post('/registro', async (req, res) => {  // --> POST
  const usr_name = req.body.usr_name;
  const usr_email = req.body.usr_email;
  const usr_password = req.body.usr_password;

  try {
    // create the user
    const user = await registerUser(usr_name, usr_email, usr_password);

    // automatically log in: create JWT and set cookie (same behaviour as /login)
    const jwtSecret = process.env.SECRET_KEY || process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT secret is not configured. Set SECRET_KEY or JWT_SECRET in the environment.');
      // fallback: redirect to home (user created) — don't block registration
      return res.redirect('/');
    }

    let token;
    try {
      token = jwt.sign({ usuario: user.name, id: user._id, admin: user.admin }, jwtSecret, { expiresIn: '2h' });
    } catch (signErr) {
      console.error('JWT signing failed after registration:', signErr.message || signErr);
      return res.redirect('/');
    }

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.IN === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000
    });

    return res.redirect('/');
  } catch (err) {
    console.error('Registro fallido:', err.message || err);

    let message = 'Error en el registro. Por favor revise los datos e inténtelo de nuevo.';

    if (err.name === 'ValidationError' && err.errors) {
      const friendlyParts = [];
      for (const e of Object.values(err.errors)) {
        const field = e.path || (e.properties && e.properties.path) || 'campo';

        if (e.kind === 'required' || (e.properties && e.properties.kind === 'required')) {
          friendlyParts.push(`El campo ${field} es obligatorio.`);
          continue;
        }

        if (e.kind === 'minlength' || (e.properties && e.properties.minlength)) {
          const min = (e.properties && e.properties.minlength) || e.properties && e.properties.min || 0;
          if (field === 'password') {
            friendlyParts.push(`La contraseña debe tener al menos ${min} caracteres.`);
          } else {
            friendlyParts.push(`El campo ${field} debe tener al menos ${min} caracteres.`);
          }
          continue;
        }

        const raw = e.message || (e.properties && e.properties.message) || '';
        const simplified = raw.replace(/Path `[^`]+` \([^)]*\)/g, '').trim();
        if (simplified) friendlyParts.push(simplified);
      }
      if (friendlyParts.length) message = friendlyParts.join(' ');
    }

    if (err.code === 11000 || err.codeName === 'DuplicateKey') {
      const key = err.keyValue ? Object.keys(err.keyValue)[0] : 'email';
      if (key === 'email') message = 'Ya existe una cuenta con ese correo electrónico.';
    }

    return res.status(400).render('registro.html', { error: message, usr_name, usr_email });
  }
});

// Salida
router.get('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.redirect('/');
});

export default router;
