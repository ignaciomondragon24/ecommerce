import express from 'express';
import ProductManager from '../dao/mongoDb/productManager.mjs';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    const products = await productManager.getAllProducts();
    const mappedProducts = products.map(product => {
        return {
            title: product.title,
            price: product.price,
            description: product.description,
            id: product._id
        }
    });
    res.render('realTimeProducts', { products: mappedProducts });
});

export default router;
