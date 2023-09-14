import { promises as fsPromises } from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
    }

    async createCart() {
      const newCart = {
        id: this.generateCartId(),
        products: [],
      };
    
      const carts = await this.loadCarts();
      carts.push(newCart);
    
      // Usar el mismo ID para guardar el carrito
      await this.saveCarts(carts, newCart.id);
    
      return newCart;
    }async createCart() {
      const newCart = {
        id: this.generateCartId(),
        products: [],
      };
      
      const carts = await this.loadCarts();
      carts.push(newCart);
      
      await this.saveCarts(carts);
      
      return newCart;
    }
    
    
    

    async getCartById(cartId) {
      const carts = await this.loadCarts();
      return carts.find(cart => cart.id === parseInt(cartId));
  }

    async addProductToCart(cartId, productId, quantity) {
        const carts = await this.loadCarts();
        const cart = carts.find((cart) => cart.id === cartId);
        if (!cart) {
            return null; // El carrito no existe
        }

        const existingProduct = cart.products.find((product) => product.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ id: productId, quantity });
        }

        await this.saveCarts(carts);

        return cart;
    }

    async loadCarts() {
        try {
            const data = await fsPromises.readFile(this.path, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    async updateCart(cart) {
      const carts = await this.loadCarts();
      const index = carts.findIndex((c) => c.id === cart.id);
    
      if (index !== -1) {
        carts[index] = cart;
        await this.saveCarts(carts); 
      }
    }

    async saveCarts(carts, cartId) {
      console.log('Guardando carritos en:', this.path);
      try {
        // Agregar el ID del carrito en el objeto antes de guardar
        const cartToSave = { id: cartId, products: [] };
        const index = carts.findIndex((c) => c.id === cartId);
        if (index !== -1) {
          cartToSave.products = carts[index].products;
        }
    
        await fsPromises.writeFile(this.path, JSON.stringify(carts, null, 2));
        console.log('Carritos guardados con éxito');
      } catch (error) {
        console.error('Error al guardar los carritos:', error);
      }
    }
    

    generateCartId() {
      return Date.now() + Math.floor(Math.random() * 1000);
    }
    
}

export default CartManager;
