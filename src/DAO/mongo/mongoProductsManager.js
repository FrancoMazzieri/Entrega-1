import productsModel from "../../models/products.js"

export class MongoProductManager {

    async addProduct(product) {

        await productsModel.create(product)

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

        const data = await productsModel.find()

        return data.find(product => product.id == pid)

    }

    async getBy(filtro = {}) {   // {stock:0}
        await productsModel.findOne(filtro).lean()
    }

    async updateProduct(pid, obj) {

        await productsModel.findOneAndReplace({ _id: pid }, obj)

    }

    async deleteProduct(pid) {

        await productsModel.findOneAndDelete({ _id: pid })

    }
}