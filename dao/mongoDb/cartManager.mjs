import mongoose from 'mongoose';
import Cart from '../models/cartModel.mjs';
//import { ObjectId } from 'mongoose/lib/schema.mjs';

// dao/mongoDb/cartManager.mjs

class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }
  async getProductosDelCarrito(cartId) {
    const cart = await Cart.findById(cartId).populate('products.product').exec(); //.populate('products.productId').exec();
    if (!cart) {
      throw new Error('Cart not found');
    }
    const productMapped = cart.products.map(product => ({
      nombre: product.product.title, // Asumiendo que 'title' es el nombre del producto
      cantidad: product.quantity,
      precio: product.product.price // Asumiendo que 'price' es el precio del producto
    }));
    return cart;
  }
  //para incluir la funcionalidad de populate
  async getCartById(cartId) {
    return await Cart.findById(cartId); //.populate('products.productId').exec();
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      return null;
    }
    const productIndex = cart.products.findIndex(product => product.product.equals(productId));
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }
    await cart.save();
    return cart;
  }

  async getAllCarts() {
    return Cart.find({});
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      return null;
    }
    cart.products = cart.products.filter(product => product.product.toString() !== productId);
    await cart.save();
    return cart;
  }

  async updateCartProducts(cartId, products) {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      return null;
    }
    cart.products = products;
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.getCartById(cartId);
    if (!cart) {
      return null;
    }
    const productIndex = cart.products.findIndex(product => product.product.toString() === productId);
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity });
    } else {
      cart.products[productIndex].quantity = quantity;
    }
    await cart.save();
    return cart;
  }

  async deleteCart(cartId) {
    const result = await Cart.deleteOne({ _id: cartId });
    return result.deletedCount > 0;
  }
}

export default CartManager;
