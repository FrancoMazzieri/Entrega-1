import { Router } from "express"
import CartManager from "../controllers/CartManager.js";

const CartRouter = Router()
const Carts = new CartManager

CartRouter.post("/", async(req, res)=>{
    res.send(await Carts.addCarts())
})
CartRouter.get("/", async(req, res)=>{
    res.send(await Carts.readCarts())
})
CartRouter.get("/:id", async(req, res)=>{
    res.send(await Carts.getCartById(req.params.id))
})
CartRouter.post("/:cid/products/:pid", async(req, res)=>{
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await Carts.addProductInCart(cartId, productId))
})

export default CartRouter