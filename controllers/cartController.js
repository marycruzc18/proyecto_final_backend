import Cart from '../dao/models/carts.model.js';

class CartController {
  async createCart(req, res) {
    try {
      const newCart = new Cart({
        products: [],
      });

      await newCart.save();

      res.send(`Carrito creado exitosamente con ID: ${newCart._id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el carrito');
    }
  }

  async getCart(req, res) {
    try {
      const { id } = req.params;
      const cart = await Cart.findById(id);

      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateCart(req, res) {
    try {
      const { id } = req.params;
      const { products } = req.body;

      const cart = await Cart.findById(id);
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
  }

  async addProductToCart(req, res) {
    try {
      const { id, pid } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findById(id);

      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' });
        return;
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId.toString() === pid
      );

      if (productIndex === -1) {
        cart.products.push({ productId: pid, quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }

      await cart.save();

      res.status(201).json({ message: 'Producto agregado al carrito con éxito', cart });
    } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async updateProductInCart(req, res) {
    try {
      const { id, pid } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findById(id);

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

      cart.products[productIndex].quantity = quantity;

      await cart.save();

      res.status(200).json({ message: 'Cantidad del producto actualizada correctamente', cart });
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { id, pid } = req.params;

      const cart = await Cart.findById(id);

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
  }

  async deleteCart(req, res) {
    try {
      const { id } = req.params;

      const cart = await Cart.findById(id);

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
  }
}

export default new CartController();
