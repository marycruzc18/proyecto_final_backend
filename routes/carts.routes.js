import express from 'express';
import CartController from '../controllers/cartController.js';


const router = express.Router();

// Ruta para crear un nuevo carrito
router.post('/api/carts', CartController.createCart);

// Ruta para obtener un carrito por ID
router.get('/api/carts/:id', CartController.getCart);

// Ruta para actualizar un carrito
router.put('/api/carts/:id', CartController.updateCart);

// Ruta para agregar un producto al carrito
router.post('/api/carts/:idcart/products/:pid', CartController.addProductToCart);

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/api/carts/:cid/products/:pid', CartController.updateProductInCart);

// Ruta para eliminar un producto del carrito
router.delete('/api/carts/:cid/products/:pid', CartController.removeProductFromCart);

// Ruta para eliminar todos los productos de un carrito
router.delete('/api/carts/:cid', CartController.deleteCart);

export default router;
