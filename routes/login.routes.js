import { Router } from 'express';
import User from '../dao/models/user.model.js'
import bcrypt from 'bcrypt';
import passport from 'passport'
import isAuthenticated from '../middleware/authMiddleware.js'
 

const router = Router();


router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect('/login'); 
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    await newUser.save();

    // Redirige a la página de éxito de registro
    return res.redirect('/registersuccess');
  } catch (error) {
    console.error('Error al registrar al usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/register', (req, res) => {
  res.render('register'); 
});

router.get('/registersuccess', (req, res) => {
  res.render('registersuccess'); 
});

  
  // Ruta para el formulario de inicio de sesión
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
  

  
  // Cerrar sesión

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    
    res.redirect('/login');
  });
});

  
  

  router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/githubcallback',
  passport.authenticate('github', {
    successRedirect: '/products',
    failureRedirect: '/login',
  })
);



router.get('/api/sessions/current', isAuthenticated, (req, res) => {
  const currentUser = req.user;
  res.status(200).json({ user: currentUser });
});



  export default router;