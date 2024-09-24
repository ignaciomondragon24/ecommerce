
import Product from '../models/productModel.mjs';

export class ProductManager {
  async searchProducts(query, sort, page, limit) {
    try {
      query = query ? (query === 'stock' ? {stock: {$gt: 0}} : {category: query}) : {};
      sort = sort ? {price: sort} : {};
      const products = await Product.paginate(query, { page, limit, sort });
      return products;
    } catch (error) {
      console.error('Error buscando productos:', error);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      return await Product.find({});
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  }

  async getProducts(page, limit, sort = undefined, query = undefined) {
    try {
      let query = {};
      if (query && sort) {
        query[query] = sort;
      }
      const products = await Product.paginate({category: 'Categoria 1'}, { page, limit, sort: query });
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      console.error(`Error getting product by id ${id}:`, error);
      throw error;
    }
  }

  async addProduct(title, price, description, stock, category, code) {
    try {
      const newProduct = new Product({ title, price, description, stock, category, code });
      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error('Error adding new product:', error);
      throw error;
    }
  }

  async updateProduct(id, productData) {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
      return updatedProduct;
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw error;
    }
  }
}

export default ProductManager;
