// Importa el middleware isAdmin y las demás dependencias necesarias
import express from 'express';
import User from '../dao/models/user.model.js';

const router = express.Router();


const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId) {
    User.findById(req.session.userId, (err, user) => {
      if (user && user.role === 'admin') {
        
        return next();
      }
     
      res.redirect('/login'); 
    });
  } else {
    
    res.redirect('/login');
  }
};

// Ruta privada solo para administradores
router.get('/admin', isAdmin, (req, res) => {
 
  res.render('admin');
});

export default router;
