import express from 'express';
import Yup from 'yup';
import ProductTable from './product.model.js';
import mongoose from 'mongoose';

const router = express.Router();

// add product
router.post(
  '/product/add',
  async (req, res, next) => {
    // create schema
    const productValidationSchema = Yup.object({
      name: Yup.string().required().trim().max(155),
      brand: Yup.string().required().trim().max(155),
      price: Yup.number().required().min(0),
      quantity: Yup.number().required().min(1),
      category: Yup.string()
        .required()
        .trim()
        .oneOf([
          'grocery',
          'electronics',
          'electrical',
          'clothing',
          'kitchen',
          'kids',
          'laundry',
        ]),

      image: Yup.string().notRequired().trim(),
    });

    try {
      req.body = await productValidationSchema.validate(req.body);
      next();
    } catch (error) {
      return res.status(400).send({ message: error.message });
    }
  },
  async (req, res) => {
    // extract new product from req.body
    const newProduct = req.body;

    // add product
    await ProductTable.create(newProduct);

    return res.status(201).send({ message: 'Product is added successfully.' });
  }
);

// get product by id
router.get(
  '/product/detail/:id',
  (req, res, next) => {
    // extract product id from req.params
    const productId = req.params.id;

    const productIDIsValid = mongoose.isValidObjectId(productId);

    if (!productIDIsValid) {
      return res.status(400).send({ message: 'Invalid product id.' });
    }

    next();
  },
  async (req, res) => {
    // extract product id from req.params
    const productId = req.params.id;

    // find product
    const product = await ProductTable.findOne({ _id: productId });

    // if not product, throw error
    if (!product) {
      return res.status(404).send({ message: 'Product does not exist.' });
    }

    return res
      .status(200)
      .send({ message: 'success', productDetails: product });
  }
);

// delete product by id

export { router as productController };
