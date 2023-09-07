import { Schema, model } from 'mongoose'

const cartSchema = new Schema({
  products: [{
    id_prop: {
      type: Schema.Types.ObjectId,
      ref: 'products',
      required: true
    },

    quantity: {
      type: Number,
      required: true
    }
  }]
})

const CartModel = model('carts', cartSchema)

export default CartModel