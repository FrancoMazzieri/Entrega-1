import { promises as fs } from 'fs'
class ProductManager {
    constructor() {
        this.path = "./src/data/product.json"

    }

    readProduct = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }
    exist = async (id) => {
        let products = await this.readProduct()
        id = Number(id);
        return products.find(prod => prod.id === id)
    }
    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product, null, 5))
    }

    addProducts = async (product) => {
        try {
            let productOld = await this.readProduct();

            if (!Array.isArray(productOld)) productOld = [];

            console.log("Producto recibido:", product);

            // Obtener el ID más alto y sumarle 1
            const maxId = productOld.length > 0 ? Math.max(...productOld.map(p => p.id)) : 0;
            const newProduct = { ...product, id: maxId + 1 };

            let productAll = [...productOld, newProduct];

            await this.writeProducts(productAll);
            return "Producto agregado";
        } catch (error) {
            console.error("Error al agregar producto:", error);
            return "Error al agregar producto";
        }
    }

    getProduct = async () => {
        return await this.readProduct()
    }
    getProductById = async (id) => {
        console.log("Buscando producto con ID:", id)

        try {
            let productById = await this.exist(id);

            console.log("Resultado de this.exist(id):", productById);

            if (!productById) {
                return { error: "Producto no encontrado" }; // Retorna un objeto de error en vez de un string
            }

            return productById; // Retorna el producto si se encuentra
        } catch (error) {
            console.error("Error al buscar el producto:", error);
            return { error: "Hubo un problema al obtener el producto" }; // Retorna un mensaje de error si ocurre una excepción
        }
    }


    updateProducts = async (id, product) => {
        let productById = this.exist(id)
        if (!productById) return "Producto no encontrado"
        await this.deleteProduct(id)
        let productOld = await this.readProduct()
        let products = [{ ...product, id: id, ...productOld }]
        await this.writeProducts(products)
        return "Producto actualizado"
    }

    deleteProduct = async (id) => {
        let products = await this.readProduct()
        id = Number(id);
        let existProduct = products.some(prod => prod.id === id)
        if (existProduct) {
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        }
        return "Producto a eliminar no existe"
    }
}

export default ProductManager





