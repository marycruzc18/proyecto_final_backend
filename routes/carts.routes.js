import mongoose from 'mongoose';
import express from 'express';
import CartManager from '../dao/CartManager.js'; 
import Cart from '../dao/models/carts.model.js'
import Product from '../dao/models/products.model.js'


const router = express.Router();
const cartManager = new CartManager('./carrito.json');

// Ruta para crear un nuevo carrito
router.post('/api/carts', async (req, res) => {
  try {
    const newCart = new Cart({
      products: []
    });

    await newCart.save();

    res.send(`Carrito creado exitosamente con ID: ${newCart._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear el carrito');
  }
});



router.post('/api/carts/:idcart/products/:pid', async (req, res) => {
  const { idcart, pid } = req.params;
  const { quantity } = req.body;

  try {
    // Buscar el carrito por ID en MongoDB
    const cart = await Cart.findById(idcart);

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Buscar el producto por ID en MongoDB
    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find((cartProduct) => cartProduct.productId.toString() === pid);

    if (existingProduct) {
      // Si el producto ya está en el carrito, actualiza la cantidad
      existingProduct.quantity += quantity;
    } else {
      // Si el producto no está en el carrito, agrégalo
      cart.products.push({ productId: pid, quantity });
    }

    // Guardar el carrito actualizado
    await cart.save();

    return res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart });
  } catch (error) {
    console.error('Error al agregar productos al carrito:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
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



// Ruta para actualizar un carrito con un arreglo de productos
router.put('/api/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      res.status(404).json({ mensaje: 'Carrito no encontrado' });
      return;
    }

    cart.products = products;
    await cart.save();

    res.json({ mensaje: 'Carrito actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error al actualizar el carrito' });
  }
});

// Ruta para actualizar la cantidad de ejemplares de un producto en el carrito
router.put('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body; 

  try {
    // Buscar el carrito por su ID
    const cart = await Cart.findById(cid);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }

    // Verificar si el producto existe en el carrito
    const productIndex = cart.products.findIndex((product) => product.productId.toString() === pid);

    if (productIndex === -1) {
      res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      return;
    }

    // Actualizar la cantidad del producto en el carrito
    cart.products[productIndex].quantity = quantity;
    
    // Guardar los cambios en el carrito
    await cart.save();

    res.status(200).json({ message: 'Cantidad del producto actualizada correctamente', cart });
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto en el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para eliminar un producto del carrito
router.delete('/api/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const cart = await Cart.findById(cid);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }

   
    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === pid
    );

    if (productIndex === -1) {
      res.status(404).json({ error: 'Producto no encontrado en el carrito' });
      return;
    }

 
    cart.products.splice(productIndex, 1);

    await cart.save();

    res.status(200).json({ message: 'Producto eliminado del carrito con éxito', cart });
  } catch (error) {
    console.error('Error al eliminar el producto del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



// Ruta para eliminar todos los productos del carrito
router.delete('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await Cart.findById(cid);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
  
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: 'Todos los productos eliminados del carrito con éxito', cart });
  } catch (error) {
    console.error('Error al eliminar todos los productos del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Define la ruta para visualizar el carrito específico
router.get('/carts/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Cart.findById(cartId).populate('products').lean();

    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    res.render('cart', {
      cart: cart,
      products: cart.products
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error al obtener el carrito');
  }
});



export default router;









