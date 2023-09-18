import User from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

class LoginController {
  async registerUser(req, res) {
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
  }

  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.render('login', { error: 'Usuario no encontrado' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.render('login', { error: 'Contraseña incorrecta' });
      }

      user.last_connection = new Date();
      await user.save();

      req.session.userValidated = true;
      req.session.userId = user._id;
      req.session.user = user;

      // Redirige al usuario a la página de productos
      return res.redirect('/products');
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
  }

  logoutUser(req, res) {
    req.logout((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      res.redirect('/login');
    });
  }

  authenticateGitHub() {
    return passport.authenticate('github');
  }

  handleGitHubCallback() {
    return passport.authenticate('github', {
      successRedirect: '/products', 
      failureRedirect: '/login'     
    });
  }

  getCurrentSession(req, res) {
    const currentUser = req.user;
    res.status(200).json({ user: currentUser });
  }
}

export default new LoginController();
