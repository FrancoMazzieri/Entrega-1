import express from "express";
import ProductRouter from "./router/product.routes.js";
import CartRouter from "./router/carts.routes.js";

const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/products", ProductRouter)
app.use("/api/cart", CartRouter)

app.listen(port, () => {
    console.log(`Servidor express puerto ${port}`)
})