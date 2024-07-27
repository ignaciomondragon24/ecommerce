// routes/carts.js
const express = require('express');
const router = express.Router();
router.use(express.json());


const CartManager = require('../dao/mongoDb/cartManager');

const cartManager = new CartManager();

// Ruta raíz POST / para crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Ruta GET /:cid para listar productos de un carrito
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const productosDelCarrito = await cartManager.getProductosDelCarrito(cid);
    if (productosDelCarrito) {
      // console.log('productosDelCarrito:', productosDelCarrito);
      res.render('cart', { productos: productosDelCarrito.products, cid: cid  });
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta POST /:cid/product/:pid para agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).send('Cart or Product not found');
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

// PUT api/carts/:cid/products/:pid
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity;
  
  const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
  if (updatedCart) {
    res.json(updatedCart);
  } else { 
    res.status(404).send('Cart or Product not found');
  }
});

// DELETE api/carts/:cid
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  const success = await cartManager.deleteCart(cid);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send('Cart not found');
  }
});
// Ruta para visualizar un carrito específico
// router.get('/:cid', async (req, res) => {
//   const { cid } = req.params;
//   try {
//     const productosDelCarrito = await cartManager.getProductosDelCarrito(cid);
//     //res.render('cart', { productos: productosDelCarrito });
//     res.json(productosDelCarrito);
//   } catch (error) {
//     console.error('Error al obtener los productos del carrito:', error);
//     res.status(500).send('Error interno del servidor');
//   }
// });
module.exports = router;
