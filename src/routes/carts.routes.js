import express from 'express';
import CartManager from '../../CartManager.js'; 

const router = express.Router();
const cartManager = new CartManager('./carrito.json');

// Ruta para crear un nuevo carrito
router.post('/api/carts', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.post('/api/carts/:idcart/products/:pid', async (req, res) => {
  const { idcart, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartManager.getCartById(idcart);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find(product => product.id === pid);

    if (existingProduct) {
      // El producto ya existe en el carrito, se agregan mas 
      existingProduct.quantity += quantity;
    } else {
      // El producto no existe en el carrito,se agrega 
      cart.products.push({ id: pid, quantity });
    }

    // Actualizar el carrito
    await cartManager.updateCart(cart);

    res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.get('/api/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }

    // Obtener la lista de productos del carrito
    const products = cart.products;

    res.status(200).json({ message: 'Productos del carrito', products });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


export default router;
