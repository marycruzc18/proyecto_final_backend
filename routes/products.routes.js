import express from 'express';
import ProductManager from '../dao/ProductManager.js';
import Product from '../dao/models/products.model.js'
import mongoose from 'mongoose';

const productRoutes = (io) => {
const router = express.Router();
const productManager = new ProductManager('./productos.json'); 

// Ruta para obtener todos los productos
router.get('/api/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      filter.$or = [
        { category: { $regex: query, $options: 'i' } }, 
        { title: { $regex: query, $options: 'i' } },  
      ];
    }

    if (req.query.availability) {
      filter.status = req.query.availability === 'true'; 
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort, 
    };

    // Realiza la consulta con paginación
    const products = await Product.paginate(filter, options);

    // Calcula información adicional para la paginación
    const totalPages = Math.ceil(products.total / limit);
    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    const result = {
      status: 'success',
      payload: products.docs,
      totalPages,
      prevPage,
      nextPage,
      page: parseInt(page),
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: prevPage !== null ? `/products?page=${prevPage}` : null,
      nextLink: nextPage !== null ? `/products?page=${nextPage}` : null,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para obtener un producto por su ID
router.get('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await Product.findById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al buscar producto por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/api/products', async (req, res) => {
  const newProduct = req.body;

  try {
    const product = new Product(newProduct); 

    const savedProduct = await product.save();

    // Emitir el evento "product_added" a través de Socket.io
    io.emit('product_added', savedProduct);

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
    
    const productId = mongoose.Types.ObjectId.createFromHexString(pid);

    const product = await Product.findOneAndUpdate({ _id: productId }, updatedProduct);

    if (product) {
      res.status(200).json({ message: 'Producto actualizado con éxito' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar un producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para eliminar un producto por su ID
router.delete('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    
    const productId = mongoose.Types.ObjectId.createFromHexString(pid);
    const deletedProduct = await Product.findOneAndDelete({ _id: productId });
    if (deletedProduct) {
      res.status(200).json({ message: 'Producto eliminado con éxito' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar un producto:', error);
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


// Ruta para mostrar todos los productos con paginación
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; 
    const result = await Product.paginate({}, { page, limit });

    const products = result.docs.map((product) => product.toObject());

    const pages = [];
    for (let i = 1; i <= result.totalPages; i++) {
      const pageItem = {
        number: i,
        numberPgBar: i,
        url: `/products?page=${i}`,
      };
      pages.push(pageItem);
    }

    res.render('products', {
      response: {
        products,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPageUrl: result.hasPrevPage ? `/products?page=${result.prevPage}` : null,
        nextPageUrl: result.hasNextPage ? `/products?page=${result.nextPage}` : null,
        pages,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los productos');
  }
});

return router;
};

export default productRoutes;