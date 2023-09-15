import express from 'express';
import CartManager from '../dao/CartManager.js'; 
import Cart from '../dao/models/carts.model.js'
import Product from '../dao/models/products.model.js'
import mongoose from 'mongoose';


const router = express.Router();
const cartManager = new CartManager('./carrito.json');

// Ruta para crear un nuevo carrito
router.post('/api/carts', async (req, res) => {
  try {
    const newCart = new Cart();
    await newCart.save();

    res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
  } catch (error) {
    console.error('Error al crear un carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.post('/api/carts/:idcart/products/:pid', async (req, res) => {
  const { idcart, pid } = req.params;
  const { quantity } = req.body;

  try {
    // Buscar el carrito por ID en MongoDB
    const cart = await Cart.findById(idcart);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }

    // Buscar el producto por ID en MongoDB
    const product = await Product.findById(pid);

    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }

    const existingProductIndex = cart.products.findIndex(
      (cartProduct) => cartProduct.productId.toString() === pid
    );

    if (existingProductIndex !== -1) {
    
      cart.products[existingProductIndex].quantity += quantity;
    } else {

      cart.products.push({ productId: pid, quantity });
    }

    await cart.save();

    res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart });
  } catch (error) {
    console.error('Error al agregar productos al carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    // Buscar el carrito por su ID utilizando el modelo de carrito de MongoDB
    const cart = await Cart.findById(cid);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }

    // Obtener los detalles de los productos relacionados con ese carrito
    const products = await Product.find({ _id: { $in: cart.products.map(p => p.productId) } });

    res.status(200).json({ message: 'Productos del carrito', products });
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



export default router;
