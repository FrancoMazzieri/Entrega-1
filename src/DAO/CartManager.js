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

        let cartById = this.exist(id)
        if (!cartById) return "carrito no encontrado"
        return cartById

    }
    addProductInCart = async (cartId, productId) => {
        let cartById = this.exist(cartId)
        if (!cartById) return "carrito no encontrado"

        let productById = await productAll.exist(productId)
        if (!productById) return "producto no encontrado"

        let cartAll = await this.readCarts()
        let cartFilter = cartAll.filter((cart) => cart.id != cartById)

        if (cartById.products.some((prod) => prod.id === productId)) {
            let productInCart = cartById.products.find((prod) => prod.id === productId)
            productInCart.cantidad++
            let cartConcat = [productInCart, ...cartFilter]
            await this.writeCarts(cartConcat)
            return "Producto sumado al carrito"
        }

        let cartConcat = [{ id: cartId, products: [{ id: productById.id, cantidad: 1 }] }, ...cartFilter]
        await this.writeCarts(cartConcat)
        return "Producto agregado al carrito"
    }
}

export default CartManager
