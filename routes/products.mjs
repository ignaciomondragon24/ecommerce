import express from 'express';
import ProductManager from '../dao/mongoDb/productManager.mjs';
import CartManager from '../dao/mongoDb/cartManager.mjs';

// routes/products.mjs

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta raíz GET / para listar todos los productos
router.get('/list', async (req, res) => {
  let { query, sort, page = 1, limit = 10 } = req.query;
  try {
    const products = await productManager.searchProducts(query, sort, parseInt(page), parseInt(limit));
    res.send(JSON.stringify({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? getLink(products.prevPage, limit, query, sort) : null,
      nextLink: products.hasNextPage ? getLink(products.nextPage, limit, query, sort) : null
    }, null, 2));
  } catch (error) {
    console.error('Error buscando productos:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.get('/', async (req, res) => {
  let { query, sort, page = 1, limit = 10, cid } = req.query;
  try {
    let isCid = req.query.cid ? true : false;
    if (!cid) {
      const newCart = await cartManager.createCart();
      cid = newCart._id;
    }
    const products = await productManager.searchProducts(query, sort, parseInt(page), parseInt(limit));
    const data = {
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? getLink(products.prevPage, limit, query, sort, '/', cid) : null,
      nextLink: products.hasNextPage ? getLink(products.nextPage, limit, query, sort, '/', cid) : null,
      isCid: isCid
    }
    data.cid = cid;
    const productsForUi = products.docs.map(product => {
      return {
        id: product._id.toString(),
        title: product.title,
        price: product.price,
        description: product.description,
      };
    });
    res.render('index', { products: productsForUi, data: data });
  } catch (error) {
    console.error('Error buscando productos:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

function getLink(page, limit, query, sort, endpoint = '/', cid) {
  let params = [];
  if (query) {
    params.push(`query=${query}`);
  }
  if (sort) {
    params.push(`sort=${sort}`);
  }
  if (limit) {
    params.push(`limit=${limit}`);
  }
  if (page) {
    params.push(`page=${page}`);
  }
  if (cid) {
    params.push(`cid=${cid}`);
  }
  let paramsAsString = params.join('&');

  return `http://localhost:8080/api/products${endpoint}?${paramsAsString}`;
}

// Ruta GET /:pid para obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).send('Product not found');
  }
});

router.get('/detail/:pid', async (req, res) => {
  let cid = null;
  if (req.query.cid) {
    cid = req.query.cid;
  }
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    const productForRender = {
      id: product._id.toString(),
      category: product.category,
      price: product.price,
      description: product.description,
      title: product.title,
    };
    res.render('productDetails', { product: productForRender, cid: cid });
  } else {
    res.status(404).send('Product not found');
  }
});

// Ruta raíz POST / para agregar un nuevo producto
router.post('/', async (req, res) => {
  const { title, price, description, stock, category, code } = req.body;
  const newProduct = await productManager.addProduct(title, price, description, stock, category, code);
  res.status(201).json(newProduct);
});

// Ruta PUT /:pid para actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).send('Product not found');
  }
});

// Ruta DELETE /:pid para eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  const success = await productManager.deleteProduct(req.params.pid);
  if (success) {
    res.status(204).send();
  } else {
    res.status(404).send('Product not found');
  }
});

export default router;
