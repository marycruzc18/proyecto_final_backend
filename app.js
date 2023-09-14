import express from 'express';
import productsRouter from './src/routes/products.routes.js'
import cartsRouter from './src/routes/carts.routes.js'

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}))


// Rutas para productos
app.use('/', productsRouter);

// Rutas para carritos
app.use('/', cartsRouter);


app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
