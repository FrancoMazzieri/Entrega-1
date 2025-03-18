import { Router } from 'express';
import ProductManager from "../DAO/ProductManager.js";

const productManager = new ProductManager();
const route = Router();

route.get('/products', async (req, res) => {
    try {
        const productos = await productManager.getProduct();
        const datos = {
            productos
        };

        res.render('home', datos);
    } catch (error) {
        console.log(error);
    }
});

route.get('/realTimeProducts', async (__, res) => {
    try {
        res.render('realTimeProducts', {
            title: 'Websockets',
            useWS: true,
            scripts: [
                'index.js'
            ]
        });
    } catch (error) {
        console.log(error);
    }
});

export default route;
