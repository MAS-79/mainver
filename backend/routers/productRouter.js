import express from 'express';
import expressAysncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils';
import Product from '../models/productModel';
const { productUpdate } = require("../controllers/user");

const productRouter = express.Router();


productRouter.get(
  '/',
  expressAysncHandler(async (req, res) => {
    const searchKeyword = req.query.searchKeyword
      ? {
          name: {
            $regex: req.query.searchKeyword,
            $options: 'i',
          },
        }
      : {};
    const products = await Product.find({ ...searchKeyword });
    res.send(products);
  })
);

productRouter.get(
  '/:id',
  expressAysncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
  })
);

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAysncHandler(async (req, res) => {
    const product = new Product({
      name: 'sample product',
      description: 'sample desc',
      warranty: 'two years',
      category: 'sample category',
      brand: 'sample brand',
      model: 'sample model',
      condition: 'sample condition',
      productcode: '0',
      image: '/images/product-1.jpg',
      image1: '/images/product-2.jpg',
      image2: '/images/product-3.jpg',
      image3: '/images/product-4.jpg',
      image4: '/images/product-5.jpg',
      
      
    });
    const createdProduct = await product.save();
    if (createdProduct) {
      res
        .status(201)
        .send({ message: 'Product Created', product: createdProduct });
    } else {
      res.status(500).send({ message: 'Error in creating product' });
    }
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAysncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.offerprice = req.body.offerprice;
      product.image = req.body.image;
      product.image1 = req.body.image1;
      product.image2 = req.body.image2;
      product.image3 = req.body.image3;
      product.image4 = req.body.image4;
  
      product.warranty = req.body.warranty;
      product.brand = req.body.brand;
      product.model = req.body.model;
      product.condition = req.body.condition;
      product.rating = req.body.rating;
      product.numReviews = req.body.numReviews;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.productcode = req.body.productcode;

      product.description = req.body.description;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        res.send({ message: 'Product Updated', product: updatedProduct });
      } else {
        res.status(500).send({ message: 'Error in updaing product' });
      }
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.put('/sold/:id', productUpdate)

// productRouter.put('/sold/:id',
//   expressAysncHandler(async (req, res) => {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);
//     if (product) {
//       product.name = req.body.name;
//       product.price = req.body.price;
//       const updatedProduct = await product.save();
//       if (updatedProduct) {
//         res.send({ message: 'Product Updated', product: updatedProduct });
//       } else {
//         res.status(500).send({ message: 'Error in updaing product' });
//       }
//     } else {
//       res.status(404).send({ message: 'Product Not Found' });
//     }
//   })
// );

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAysncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deletedProduct = await product.deleteOne();
      res.send({ message: 'Product Deleted', product: deletedProduct });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default productRouter;
