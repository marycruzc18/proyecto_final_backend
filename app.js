import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import productsRouter from './routes/products.routes.js'
import cartsRouter from './routes/carts.routes.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    }
});

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para productos
app.use('/', productsRouter(io));
// Rutas para carritos
app.use('/', cartsRouter); 

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

});

server.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});





