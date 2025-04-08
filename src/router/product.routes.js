import { Router } from "express"
import { MongoProductManager } from "../DAO/mongo/mongoProductsManager.js";

const ProductRouter = Router()
const mongoProductManager = new MongoProductManager()

ProductRouter.get('/', async (req, res) => {

    let { page, limit } = req.query
    if (!page) {
        page = 1
    }
    if (!limit) {
        limit = 1
    }
    let { docs: product, totalPages, hasNextPage, nextPage, hasPrevPage, prevPage } = await mongoProductManager.getProducts(page, limit)


    res.setHeader('Content-Type', 'application/json')
    res.status(200).json({
        product,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        page,
    })

})

ProductRouter.post("/", async (req, res) => {
    let { title, code, stock, price, description, status, category, thumbnail } = req.body
    if (!title || !code || !price) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `title | code | price son requeridos` })
    }

    // resto de validaciones pertinentes
    try {
        let existe = await mongoProductManager.getBy({ code })
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ya existe un producto con code ${code} en DB` })
        }

        let nuevoProducto = await mongoProductManager.addProduct({ title, code, stock, price, description, status, category, thumbnail })
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ message: "Producto generado!", nuevoProducto });
    } catch (error) {
        console.error("Error al enviar productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})

ProductRouter.put("/:id", async (req, res) => {

    try {

        let id = req.params.id
        let updateProducts = req.body
        res.send(await mongoProductManager.updateProduct(id, updateProducts))

    } catch (error) {
        console.log(error)
    }
})
ProductRouter.delete("/:id", async (req, res) => {

    try {
        let id = req.params.id
        res.send(await mongoProductManager.deleteProduct(id))

    } catch (error) {
        console.log(error)
    }
})
export default ProductRouter