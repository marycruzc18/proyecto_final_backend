import express from 'express';
import ProductManager from '../ProductManager.js';


const productRoutes = (io) => {
const router = express.Router();
const productManager = new ProductManager('./productos.json'); 

// Ruta para obtener todos los productos
router.get('/api/products', async (req, res) => {
  try {
      const products = await productManager.getProducts();
      const { limit } = req.query;

      if (limit) {
          const limitedProducts = products.slice(0, parseInt(limit, 10));
          res.json(limitedProducts);
      } else {
          res.json(products);
      }
  } catch (error) {
    res.status(404).send({ mensaje: 'Producto no existe' });
  }
});


// Ruta para obtener un producto por su ID
router.get('/api/products/:pid', async (req, res) => {
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
router.post('/api/products', async (req, res) => {
  const newProduct = req.body;
  try {
    const productId = await productManager.addProduct(newProduct);

    // Emitir el evento "product_added" a través de Socket.io
    io.emit('product_added', newProduct);

    res.status(201).json({ message: 'Producto agregado con éxito' });
  } catch (error) {
    console.error('Error al agregar un producto:', error); 
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para actualizar un producto por su ID
router.put('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  try {
      // Convierte el pid a un número
      const productId = parseInt(pid);
      const updated = await productManager.updateProduct(productId, updatedProduct);
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
router.delete('/api/products/:pid', async (req, res) => {
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

// Ruta para la pagina de inicio
router.get('/', async (req, res) => {
    try {
      const products = await productManager.getAllProducts(); 
  
      res.render('home', { products });
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
  
 // Ruta para la vista en tiempo real
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

return router;
};

export default productRoutes;