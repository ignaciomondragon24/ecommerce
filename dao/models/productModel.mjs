import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// dao/models/productModel.js
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  stock: Number,
  timestamp: { type: Date, default: Date.now },
  category: { type: String, required: false },
  code: { type: String, required: false },
});

// índice de texto
productSchema.index({ name: 'text', description: 'text' });

//  plugin de paginación
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
