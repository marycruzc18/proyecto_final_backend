
import {} from 'dotenv/config'

import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'
import Message from './dao/models/messages.model.js'
import session from 'express-session'
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './passport/passport.js'
import loginRoutes from './routes/login.routes.js'


const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});





app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const store = MongoStore.create({
    mongoUrl: MONGOOSE_URL,
    mongoOptions: {},
    ttl: 30
  });
  
  
  
  app.use(session({
    store:store,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized : false
  }))

  mongoose.connect(MONGOOSE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Conexión a MongoDB establecida correctamente');
  }).catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });
  
  initializePassport()
  app.use(passport.initialize());
  app.use(passport.session());

// Rutas para productos
app.use('/', productsRouter(io));
// Rutas para carritos
app.use('/', cartsRouter); ;
//Rutas para mensajes 
app.get('/chat', (req, res) => {
    res.render('chat');
});

//Ruta para login
app.use('/', loginRoutes);


app.use('/public', express.static(`${__dirname}/public`));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

io.on('connection', (socket) => {
    console.log(`Cliente conectado (${socket.id})`);
    socket.emit('server_confirm', 'Conexión recibida');
    socket.on('product_added', (product) => {
        console.log(`Producto agregado: ${JSON.stringify(product)}`);
        io.emit('product_added', product);
    });

    // Envío de mensaje 
socket.on('send_message', async (messageData) => {
    console.log(`Mensaje recibido de ${messageData.user}: ${messageData.message}`);

    const message = new Message(messageData);
    await message.save();

    io.emit('receive_message', messageData);
});

socket.on('new_product_in_cart', (product_id) => {
   
    console.log('Nuevo producto agregado al carrito:', product_id);

    // Emitir un evento de confirmación si es necesario
    socket.emit('product_added_to_cart', product_id);
  });

});


 


server.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});


  



