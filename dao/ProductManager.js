import { promises as fsPromises } from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        const products = await this.loadProducts();
        product.id = this.generateNextId(products);
        products.push(product);
        await this.saveProducts(products);
        return product.id;
    }

    async getProducts() {
        const products = await this.loadProducts();
        return products;
    }

    async getProductById(id) {
        const products = await this.loadProducts();
        const product = products.find(product => product.id === parseInt(id));
        return product;
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.loadProducts();
        const index = products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            updatedProduct.id = id;
            products[index] = updatedProduct;
            await this.saveProducts(products);
            return true;
        }
        return false;
    }

    async deleteProduct(id) {
        const products = await this.loadProducts();
        const index = products.findIndex(product => product.id === parseInt(id));
        if (index !== -1) {
            products.splice(index, 1);
            await this.saveProducts(products);
            return true;
        }
        return false;
    }

    async loadProducts() {
        try {
            const data = await fsPromises.readFile(this.path, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    async saveProducts(products) {
        await fsPromises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    generateNextId(products) {
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }

    async getAllProducts() {
        try {
          const data = await fsPromises.readFile(this.path, 'utf-8');
          const products = JSON.parse(data);
          return products;
        } catch (error) {
          console.error('Error al obtener productos:', error);
          throw error;
        }
      }
      
    
}

export default ProductManager;

