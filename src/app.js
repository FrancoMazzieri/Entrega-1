import express from "express";
import mongoose from "mongoose";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import ViewsRouter from "./router/views.routes.js";
import ExpressHandlebars from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoProductManager } from "./DAO/mongo/mongoProductsManager.js";


const productManager = new MongoProductManager();

const app = express()
const httpServer = createServer(app); // Create HTTP server
const io = new Server(httpServer); // Pass HTTP server to socket.io

const port = 8080
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/public')))

// Conexion mongoose
mongoose.connect("mongodb+srv://frank:K09G390O2V5Xqw70@codertest.nxksjus.mongodb.net/?retryWrites=true&w=majority&appName=CoderTest")
    .then(() => {
        console.log("conectado a la base de datos")
    })
    .catch(error => { console.error("La conexion no se ha podido realizar", error) })

// Configuración de Socket.io
io.on('connection', async (clientSocket) => {
    console.log(`Nuevo cliente conectado: ${clientSocket.id}`);

    try {
        const productos = await productManager.getProducts();
        clientSocket.emit('mensajeServer', productos.docs);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        clientSocket.emit('errorServer', { error: "No se pudieron cargar los productos." });
    }

    // Agregar producto
    clientSocket.on('product', async data => {
        console.log('data: ', data)
        const product = data;
        try {
            await productManager.addProduct(product)
            let datos = await productManager.getProducts()
            io.emit('productoAgregado', datos)
        } catch (error) {
            console.log(error)

        }
    })

    // Eliminar producto
    clientSocket.on('deleteProduct', async data => {
        try {
            await productManager.deleteProduct(data)
            let datos = await productManager.getProducts()
            io.emit('productoEliminado', datos)
        } catch (error) {
            console.log(error)
        }
    })

    clientSocket.on("disconnect", () => {
        console.log(`Cliente ${clientSocket.id} desconectado`);
    });
});

// Configuración de Socket.io
/*io.on("connection", async (clientSocket) => {
    console.log("Nuevo cliente se ha conectado");
    try {
        const productos = await productManager.getProducts()
        clientSocket.emit('mensajeServer', productos)
    } catch (error) {
        console.log(error)
    }

    clientSocket.on('product', async data => {
        console.log('data: ', data)
        const product = data;
        try {
            await productManager.addProduct(product)
            let datos = await productManager.getProducts()
            io.emit('productoAgregado', datos)
        } catch (error) {
            console.log(error)

        }
    })

    clientSocket.on('deleteProduct', async data => {
        try {
            await productManager.deleteProduct(data)
            let datos = await productManager.getProducts()
            io.emit('productoEliminado', datos)
        } catch (error) {
            console.log(error)
        }
    })


});*/



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