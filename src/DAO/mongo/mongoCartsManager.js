import cartsModel from "../../models/carts.js"
import productsModel from "../../models/products.js"

export class MongoCartManager {

    async createCart() {
        const cart = new cartsModel({ products: [] }); // o como tengas definido tu modelo
        return await cart.save(); // Esto devuelve el carrito con su _id
    }

    async uploadProduct(cid, pid) {
        // Verificar si el carrito existe
        const carrito = await cartsModel.findById(cid);
        if (!carrito) {
            console.log("Carrito no encontrado");
            return null;
        }

        // Verificar si el producto existe (en la colección de productos)
        const productoExistente = await productsModel.findById(pid);
        if (!productoExistente) {
            console.log("Producto no encontrado");
            return null;
        }

        // Buscar si ya está en el carrito
        const productoEnCarrito = carrito.products.find(p => p.products?.toString() === pid);

        if (productoEnCarrito) {
            // Si existe, incrementar cantidad
            await cartsModel.updateOne(
                { _id: cid },
                {
                    $set: {
                        'products.$[elem]': {
                            products: pid,
                            quantity: productoEnCarrito.quantity + 1
                        }
                    }
                },
                {
                    arrayFilters: [{ 'elem.pid': pid }]
                }
            );
        } else {
            // Si no existe, agregarlo al array
            await cartsModel.findByIdAndUpdate(
                cid,
                { $push: { products: { products: pid, quantity: 1 } } }
            );
        }

        // Devolver el carrito actualizado
        return await cartsModel.findById(cid).populate('products.products');
    }


    async getCartProducts(cid) {

        const cart = await cartsModel.findById(cid)
            .populate('products.products')
            .lean()

        if (!cart) throw new Error('Carrito no encontrado')
        return cart.products
    }


    async deleteProduct(cid, pid) {

    let carrito = await cartsModel.findOne({ _id: cid })

    let products = carrito.products.filter(product => product.pid != pid)

    console.log(products)

    await cartsModel.updateOne(
        { _id: cid },
        {
            $set: {
                'products': products
            }
        }
    )

}

    async deleteCartProducts(cid) {

    let products = []

    await cartsModel.updateOne(
        {
            _id: cid
        },
        {
            $set:
            {
                'products': products
            }
        }
    )

}

    async arrayProductsUpdate(cid, data) {

    await cartsModel.updateOne(
        {
            _id: cid
        },
        {
            $set:
            {
                'products': data
            }
        }
    )

}
}