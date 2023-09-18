import { Router } from 'express';
import LoginController from '../controllers/loginController.js';
import passport from 'passport';


const router = Router();

// Rutas para el registro de usuarios
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', LoginController.registerUser);

router.get('/registersuccess', (req, res) => {
  res.render('registersuccess');
});

// Rutas para iniciar sesión
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
   
    res.redirect('/products');
    
    
  } catch (error) {
    console.error('Error en la ruta de inicio de sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// Ruta para cerrar sesión
router.get('/logout', LoginController.logoutUser);

// Rutas de autenticación de GitHub
router.get('/auth/github', LoginController.authenticateGitHub());

router.get('/githubcallback', LoginController.handleGitHubCallback());

// Ruta para obtener la sesión actual
router.get('/api/sessions/current', LoginController.getCurrentSession);

export default router;
