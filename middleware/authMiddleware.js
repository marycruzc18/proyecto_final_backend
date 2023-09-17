import passport from 'passport';

// Middleware para verificar si un usuario está autenticado
function authenticateUser(req, res, next) {
  
  if (req.isAuthenticated()) {
    // Si el usuario está autenticado, permite que la solicitud continúe
    return next();
  }
  // Si el usuario no está autenticado, redirige a la página de inicio de sesión
  res.redirect('/login');
}

// Exporta el middleware
export default authenticateUser;




