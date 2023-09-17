import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../dao/models/user.model.js';

const initializePassport = () => {
  passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Usuario no encontrado' }); }

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        user.comparePassword(password, (passwordErr, isMatch) => {
          if (passwordErr) { return done(passwordErr); }
          if (!isMatch) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }
          return done(null, user); 
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

export default initializePassport;
