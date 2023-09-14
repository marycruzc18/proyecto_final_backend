import express from 'express';
import ProductManager from '../../ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('./productos.json'); 

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
    const newProduct = req.body;
    try {
        const productId = await productManager.addProduct(newProduct);
        res.status(201).json({ id: productId });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedProduct = req.body;
    try {
        const updated = await productManager.updateProduct(pid, updatedProduct);
        if (updated) {
            res.status(200).json({ message: 'Producto actualizado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deleted = await productManager.deleteProduct(pid);
        if (deleted) {
            res.status(200).json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;
