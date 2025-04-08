import { Schema, model } from "mongoose";

const cartCollection = 'carts'

const cartSchema = Schema({
    products: {
        type: [{
            products: {
                type: Schema.Types.ObjectId,
                ref: 'products'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }]
    }
})

cartSchema.pre('find', function(){
    this.populate('products.products')
})


export default model(cartCollection, cartSchema)