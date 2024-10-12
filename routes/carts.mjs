import { Router } from "express";
import Cart from "../dao/models/cartModel.mjs";
import Product from "../dao/models/productModel.mjs";
import { TicketModel } from "../dao/models/ticketModel.mjs";
import { isUser } from "../middlewares/authmiddleware.mjs"; // Asegúrate de que el nombre del archivo coincida
import passport from "passport";
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Ruta para agregar un producto a un carrito
router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE api/carts/:cid/products/:pid
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const updatedCart = await cartManager.removeProductFromCart(cid, pid);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).send('Cart or Product not found');
  }
});

// PUT api/carts/:cid
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const updatedCart = await cartManager.updateCartProducts(cid, req.body.products);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).send('Cart not found');
  }
});

// Ruta POST /:cid/purchase para realizar una compra
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }), isUser, async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid).populate('products.product');
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }

  let totalAmount = 0;
  const productsNotPurchased = [];

  for (const item of cart.products) {
    const product = item.product;
    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      totalAmount += product.price * item.quantity;
      await product.save();
    } else {
      productsNotPurchased.push(product._id);
    }
  }

  const ticket = new TicketModel({
    code: uuidv4(),
    amount: totalAmount,
    purchaser: req.user.email
  });

  await ticket.save();

  cart.products = cart.products.filter(item => productsNotPurchased.includes(item.product._id));
  await cart.save();

  res.json({ ticket, productsNotPurchased });
});

export default router;