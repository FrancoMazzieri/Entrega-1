import { Router } from "express"
import { MongoProductManager } from "../DAO/mongo/mongoProductsManager.js";

const ProductRouter = Router()
const product = new MongoProductManager()

ProductRouter.get('/', async (req, res) => {
    let { limit = 10, page = 1 } = req.query; // Asigna 10 por defecto si no se recibe limit
    limit = parseInt(limit);
    page = parseInt(page);

    try {
        let data = await product.getProducts(limit, page);
        res.json(data.docs); // Envía los productos en formato JSON
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});
ProductRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.getProductById(id))

})

ProductRouter.post("/", async (req, res) => {
    let newProduct = req.body
    res.send(await product.addProduct(newProduct))
})

ProductRouter.put("/:id", async (req, res) => {
    let id = req.params.id
    let updateProducts = req.body
    res.send(await product.updateProduct(id, updateProducts))
})

ProductRouter.delete("/:id", async (req, res) => {
    let id = req.params.id
    res.send(await product.deleteProduct(id))
})
export default ProductRouter