import { promises as fs } from 'fs'
import { nanoid } from 'nanoid'
class ProductManager {
    constructor() {
        this.path = "./src/models/product.json"

    }

    readProduct = async () => {
        let products = await fs.readFile(this.path, "utf-8")
        return JSON.parse(products)
    }
    exist = async (id) =>{
        let products = await this.readProduct()
        return products.find(prod => prod.id === id)
    }
    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product))
    }


    addProducts = async (product) => {
        let productOld = await this.readProduct()
        product.id = nanoid()
        let productAll = [...productOld, product]
        await this.writeProducts(productAll)
        return "Producto agregado"
    }
    getProduct = async () => {
        return await this.readProduct()
    }
    getProductById = async (id) => {
        
        let productById = this.exist(id)
        if(!productById) return "Producto no encontrado"
        return productById

    }
    
    updateProducts = async(id, product) =>{
        let productById = this.exist(id)
        if(!productById) return "Producto no encontrado"
        await this.deleteProduct(id)
        let productOld = await this.readProduct()
        let products = [{...product, id : id, ...productOld}]
        await this.writeProducts(products)
        return "Producto actualizado"
    }

    deleteProduct = async (id) =>{
        let products = await this.readProduct()
        let existProduct = products.some(prod => prod.id === id)
        if(existProduct){
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        }
        return "Producto a eliminar no existe"
    }

}
export default ProductManager





