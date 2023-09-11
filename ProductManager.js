const fs = require('fs');

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
        const product = products.find(p => p.id === id);
        return product;
    }

    async updateProduct(id, updatedProduct) {
        const products = await this.loadProducts();
        const index = products.findIndex(p => p.id === id);
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
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            await this.saveProducts(products);
            return true;
        }
        return false;
    }

    async loadProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            return [];
        }
    }

    async saveProducts(products) {
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    }

    generateNextId(products) {
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
    }
}

// Casos de uso:
const productManager = new ProductManager('productos.json');

(async () => {
    await productManager.addProduct({
        title: 'Zarcillo',
        description: 'Zarcillo Dorado',
        price: 1.099,
        thumbnail: 'sin imagen',
        code: 5654,
        stock: 300,
    });

    await productManager.addProduct({
        title: 'Cadena',
        description: 'Cadena',
        price: 1.500,
        thumbnail: 'sin imagen',
        code: 5653,
        stock: 30,
    });

    const products = await productManager.getProducts();
    console.log('Lista de productos:');
    console.log(products);

    const productId = 1;
    const product = await productManager.getProductById(productId);
    if (product) {
        console.log(`Producto con ID ${productId}:`);
        console.log(product);

        const updatedProduct = {
            title: 'Zarcillo',
            description: 'Zaecillo Dorado',
            price: 1.299,
            thumbnail: 'imagen1_actualizada.jpg',
            code: 5654,
            stock: 90,
        };

        await productManager.updateProduct(productId, updatedProduct);
        console.log(`Producto con ID ${productId} actualizado:`);
        console.log(await productManager.getProductById(productId));

        await productManager.deleteProduct(productId);
        console.log(`Producto con ID ${productId} eliminado:`);
        console.log(await productManager.getProducts());
    } else {
        console.error(`Producto con ID ${productId} no encontrado.`);
    }
})();

