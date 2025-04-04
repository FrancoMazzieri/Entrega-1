import productsModel from "../../models/products.js"

export class MongoProductManager {

    async addProduct(product) {
        try {
            await productsModel.create(product)
        } catch (error) {
            console.log(error)
        }
    }

    async getProducts(limit = 10, page = 1, filtro = {}, sort = {}) {
        try {
            const options = {
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                lean: true,
            };

            const products = await productsModel.paginate(filtro, options);
            return products;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw new Error("No se pudieron obtener los productos.");
        }
    }

    async getProductById(pid) {
        try {
            const data = await productsModel.find()

            return data.find(product => product.id == pid)
        } catch (error) {
            console.log(error)
        }
    }

    async updateProduct(pid, obj) {
        try {
            await productsModel.findOneAndReplace({ _id: pid }, obj)
        } catch (error) {
            console.log(error)
        }
    }

    async deleteProduct(pid) {
        try {
            await productsModel.findOneAndDelete({ _id: pid })
        } catch (error) {
            console.log(error)
        }
    }
}