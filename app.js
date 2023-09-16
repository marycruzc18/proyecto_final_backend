
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




const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;

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

// Rutas para productos
app.use('/', productsRouter(io));
// Rutas para carritos
app.use('/', cartsRouter); ;
//Rutas para mensajes 
app.get('/chat', (req, res) => {
    res.render('chat');
});



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


  mongoose.connect('mongodb+srv://marycruz18:mcoderdb@cluster0.6ci8xpp.mongodb.net/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



// Maneja eventos de conexión y error
mongoose.connection.on('connected', () => {
    console.log('Conectado a MongoDB');
  });



server.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});





