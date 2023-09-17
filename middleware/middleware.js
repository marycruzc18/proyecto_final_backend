// Importa el middleware isAdmin y las demás dependencias necesarias
import express from 'express';
import User from '../dao/models/user.model.js';

const router = express.Router();

// Middleware para verificar el rol de administrador
const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId) {
    User.findById(req.session.userId, (err, user) => {
      if (user && user.role === 'admin') {
        // El usuario es un administrador, permite continuar
        return next();
      }
      // El usuario no es un administrador, redirige a alguna parte
      res.redirect('/login'); // o cualquier otra ruta apropiada
    });
  } else {
    // No hay sesión, redirige al inicio de sesión
    res.redirect('/login');
  }
};

// Ruta privada solo para administradores
router.get('/admin', isAdmin, (req, res) => {
  // Esta ruta solo está disponible para administradores
  res.render('admin');
});

export default router;
