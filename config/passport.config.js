import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2';
import User from '../dao/models/user.model.js';

const initializePassport = () => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Buscar el usuario por nombre de usuario o correo electrónico
        const user = await UserModel.findOne({
          $or: [{ username }, { email: username }],
        }).exec();

        // Si no se encuentra el usuario, indicar un error de autenticación
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Verifico la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);

        // Si la contraseña no coincide, indicar un error 
        if (!passwordMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Autenticación exitosa, devolver el usuario
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
         
          user = new User({
            githubId: profile.id,
            username: profile.username,
           
          });
          await user.save();
        }

        
        return done(null, user);
      } catch (error) {
      
        return done(error);
      }
    }
  )
);

}


export default initializePassport;