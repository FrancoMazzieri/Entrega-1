import { promises as fs } from 'fs'
import ProductManager from './ProductManager.js'

const productAll = new ProductManager
let idt = 1
class CartManager {
    constructor() {

        this.path = "./src/data/Carts.json"

    }

    readCarts = async () => {
        let carts = await fs.readFile(this.path, "utf-8")
        return JSON.parse(carts)
    }

    writeCarts = async (carts) => {
        await fs.writeFile(this.path, JSON.stringify(carts, null, 5))
    }

    exist = async (id) => {
        let carts = await this.readCarts()
        id = Number(id);
        return carts.find(cart => cart.id === id)
    }

    addCarts = async () => {
        let cartsOld = await this.readCarts()
        let id = cartsOld.length + 1
        let cartsAll = [{ id: id, products: [] }, ...cartsOld]
        await this.writeCarts(cartsAll)
        return "Carrito agregado"
    }
    getCartById = async (id) => {

        let cartById = await this.exist(id)

        console.log("Resultado de this.exist(id):", cartById);

        if (!cartById) return "carrito no encontrado"

        return cartById

    }
    addProductInCart = async (cartId, productId) => {
        try {
            cartId = Number(cartId);
            productId = Number(productId);
    
            if (isNaN(cartId) || isNaN(productId)) {
                return { error: "IDs de carrito o producto no son válidos" };
            }
    
            let cartById = await this.exist(cartId);
            if (!cartById) return { error: "Carrito no encontrado" };
    
            let productById = await productAll.exist(productId);
            if (!productById) return { error: "Producto no encontrado" };
    
            // Obtener todos los carritos y filtrar el que se está editando
            let cartAll = await this.readCarts();
            let cartFilter = cartAll.filter((cart) => cart.id !== cartById.id);
    
            // Clonar los productos para evitar modificar directamente el carrito
            let updatedProducts = [...cartById.products];
    
            let existingProduct = updatedProducts.find((prod) => prod.id === productId);
            if (existingProduct) {
                existingProduct.cantidad++;
            } else {
                updatedProducts.push({ id: productById.id, cantidad: 1 });
            }
    
            // Crear nuevo carrito actualizado
            let updatedCart = { ...cartById, products: updatedProducts };
            let updatedCarts = [updatedCart, ...cartFilter];
    
            await this.writeCarts(updatedCarts);
    
            return {
                success: true,
                message: existingProduct ? "Producto sumado al carrito" : "Producto agregado al carrito",
                cart: updatedCart,
            };
        } catch (error) {
            console.error("Error en addProductInCart:", error);
            return { error: "Error interno del servidor" };
        }
    };
}

export default CartManager
