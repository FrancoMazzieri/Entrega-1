import express from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import ViewsRouter from "./router/views.routes.js";
import ExpressHandlebars from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ProductManager from "./DAO/ProductManager.js";

const productManager = new ProductManager();

const app = express()
const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer); // Pass HTTP server to socket.io

const port = 8080
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')))

// Configuración de Socket.io
io.on("connection", async (clientSocket) => {
    console.log("Nuevo cliente se ha conectado");
    try {
        const productos = await productManager.getProduct()
        clientSocket.emit('mensajeServer', productos)
    } catch (error) {
        console.log(error)
    }

    clientSocket.on('product', async data => {
        console.log('data: ', data)
        const product = data;
        try {
            await productManager.addProducts(product)
            let datos = await productManager.getProduct()
            io.emit('productoAgregado', datos)
        } catch (error) {
            console.log(error)

        }
    })

    /*clientSocket.on('deleteProduct', async data => {
        try {
            await ProductManager.deleteProduct(data)
            let datos = await ProductManager.getProduct()
            io.emit('productoEliminado', datos)
        } catch (error) {
            console.log(error)
        }
    })
*/


});

app.engine('handlebars', ExpressHandlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/views'))

app.use('/', ViewsRouter)
app.use("/api/product", ProductRouter)
app.use("/api/carts", CartRouter)

httpServer.listen(port, () => {
    console.log(`Servidor express + socket.io en puerto ${port}`);
});