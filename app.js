import express from 'express';
import bodyParser from 'body-parser';
import ProductManager from './ProductManager.js'; 

const app = express();
const port = 3000;
const productManager = new ProductManager('productos.json');

app.use(bodyParser.json());

app.get('/products', async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = await productManager.getProducts(limit);
    res.json(products);
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = await productManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});
