import { Router } from "express"
import { MongoProductManager } from "../DAO/mongo/mongoProductsManager.js"
import { MongoCartManager } from "../DAO/mongo/mongoCartsManager.js"

const mongoProductManager = new MongoProductManager
const mongoCartManager = new MongoCartManager

const router = Router()

router.get('/products', async (req, res) => {
    let { limit = 10, page = 1, query, sort } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    let filtro = query ? { category: query } : {};
    let orden = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};

    try {
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } =
            await mongoProductManager.getProducts(limit, page, filtro, orden);

        let datos = {
            productos: docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit,
            query,
            sort,
        };
        res.render('home', datos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params
    const { limit = 1, page = 1 } = req.query
    console.log(limit)
    try {
        const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = await mongoCartManager.getCartProducts(cid, limit, page)
        let data = docs[0].products
        let datos = {
            productos: data,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page,
            limit
        }
        res.render('carts', datos)
    } catch (error) {
        console.log(error)
    }
})

router.get('/realtimeproducts', (req, res) => {
    try {
        res.render('realTimeProducts')
    } catch (error) {
        console.log(error)
    }


})


export default router