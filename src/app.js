import express from "express";
import mongoose from "mongoose";

import session from 'express-session';
import MongoStore from 'connect-mongo' // esto es para el manejo de sessions

import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";
import ViewsRouter from "./router/views.routes.js";
import sessionsRouter from './router/sessions.router.js'
import usersViewRouter from './router/users.views.router.js'

import ExpressHandlebars from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoProductManager } from "./DAO/mongo/mongoProductsManager.js";

// Passport
import passport from 'passport';
import initializePassport from './config/passport.config.js'

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

const MONGO_URL = "mongodb://localhost:27017/testEntrega1?retryWrites=true&w=majority";
app.use(session(
    {
        //ttl: Time to live in seconds,
        //retries: Reintentos para que el servidor lea el archivo del storage.
        //path: Ruta a donde se buscará el archivo del session store.

        // store: new fileStore({ path: './session', ttl: 120, retries: 3 }),
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
            ttl: 10,
        }),


        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true,
    }
))

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

app.engine('handlebars', ExpressHandlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/views'))

app.use('/', ViewsRouter)
app.use("/api/products", ProductRouter)
app.use("/api/carts", CartRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/users', usersViewRouter)

// Middleware Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

httpServer.listen(port, () => {
    console.log(`Servidor express + socket.io en puerto ${port}`);
});

// Conectamos la base de datos
const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect to MongoDB");
        process.exit();
    }
}
connectMongoDB();