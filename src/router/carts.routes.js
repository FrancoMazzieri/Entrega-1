import { Router } from "express"
import { MongoCartManager } from "../DAO/mongo/mongoCartsManager.js"

const router = Router()

const mongoCartManager = new MongoCartManager

router.post('/', async (req, res) => {
    try {
        const newCart = await mongoCartManager.createCart();
        res.status(201).json({
            mensaje: "Carrito creado",
            id: newCart._id // Aquí accedés al ID
        });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ error: "No se pudo crear el carrito" });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cartProducts = await mongoCartManager.getCartProducts(cid)
        res.json(cartProducts)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener los productos del carrito' })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        await mongoCartManager.uploadProduct(cid, pid)

        res.send({ mensaje: "producto agregado al carrito" })

    } catch (error) {
        console.log(error)
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        await mongoCartManager.deleteProduct(cid, pid)

        res.send({ mensaje: "producto eliminado del carrito" })

    } catch (error) {
        console.log(error)
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await mongoCartManager.uploadProduct(cid, pid);

        if (!updatedCart) {
            return res.status(404).json({ mensaje: "Carrito o producto no encontrado" });
        }

        res.status(200).json({ mensaje: "Producto agregado al carrito", carrito: updatedCart });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid, pid } = req.params         // se reciben cid, pid de los parametros

    try {
        await mongoCartManager.deleteCartProducts(cid)

        res.send({ mensaje: "todos los productos eliminados del carrito" })

    } catch (error) {
        console.log(error)
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params         // se reciben cid, pid de los parametros
    const data = req.body

    try {
        await mongoCartManager.arrayProductsUpdate(cid, data)

        res.send({ mensaje: "Array de productos agregado al carrito" })

    } catch (error) {
        console.log(error)
    }
})

export default router