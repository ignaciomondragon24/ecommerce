import mongoose from 'mongoose';

// dao/models/cartModel.mjs

const cartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  timestamp: { type: Date, default: Date.now }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
