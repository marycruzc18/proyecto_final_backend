class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error("Todos los campos son obligatorios.");
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error("Ya existe un producto con el mismo código.");
            return;
        }

        const product = {
            id: this.nextId++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(product);
        console.log(`Producto agregado con ID ${product.id}`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado.");
        }
    }
}

// Casos de uso:
const manager = new ProductManager();

manager.addProduct("Zarcillos", "Zarcillos Estrella", 1.200, "imagen1.jpg", 5456, 100);
manager.addProduct("Cadena", "Cadena trenzada", 3.000, "imagen2.jpg", 4353, 50);

console.log("Lista de productos:");
console.log(manager.getProducts());

const product = manager.getProductById(5);
if (product) {
    console.log("Producto encontrado:");
    console.log(product);
}

manager.addProduct("Zarcillos", "Zarcillos Estrella", 1.200, "imagen1.jpg", 5456, 100); // Introducir un código duplicado para probar la validación
