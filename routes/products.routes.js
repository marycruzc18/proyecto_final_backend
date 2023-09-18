import express from 'express';
import ProductController from '../controllers/productController.js'

const productRouter = express.Router();
const productController = new ProductController(); // Crea una instancia del controlador

// Ruta para obtener todos los productos
productRouter.get('/api/products', (req, res) => productController.getProducts(req, res));

// Ruta para obtener un producto por su ID
productRouter.get('/api/products/:pid', (req, res) => productController.getProductById(req, res));

// Ruta para agregar un nuevo producto
productRouter.post('/api/products', (req, res) => productController.createProduct(req, res));

// Ruta para actualizar un producto por su ID
productRouter.put('/api/products/:pid', (req, res) => productController.updateProduct(req, res));

// Ruta para eliminar un producto por su ID
productRouter.delete('/api/products/:pid', (req, res) => productController.deleteProduct(req, res));

// Ruta para la página de inicio
productRouter.get('/', (req, res) => productController.getHome(req, res));

// Ruta para la vista en tiempo real
productRouter.get('/realtimeproducts', (req, res) => productController.getRealTimeProducts(req, res));

// Ruta para mostrar todos los productos con paginación
productRouter.get('/products', (req, res) => productController.getAllProducts(req, res));

export default productRouter;
