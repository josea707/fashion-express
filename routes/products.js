const express = require('express');
const { Product, Review } = require('../models/Product');
const { check, validationResult, query } = require('express-validator');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// @route GET api/products
// @desc Get products and filter or sort it out
// @access Public
router.get('/', async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : {};
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const startIndex = req.query.page && req.query.limit ? (page - 1) * limit : 0;
  const category = req.query.category ? { category: req.query.category } : {};
  const gender = req.query.gender ? { gender: req.query.gender } : {};
  const _id = req.query._id
    ? req.query._id.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: req.query._id }
      : {}
    : {};
  const name =
    req.query.name && !req.query.name.match(/^[0-9a-fA-F]{24}$/)
      ? { name: { $regex: req.query.name, $options: 'i' } }
      : {};
  const brand =
    req.query.brand && !req.query.brand.match(/^[0-9a-fA-F]{24}$/)
      ? { brand: { $regex: req.query.brand, $options: 'i' } }
      : {};
  /* const category = req.query.category ? req.query.category : '';*/
  const sortOrder = req.query.sortOrder
    ? req.query.sortOrder === 'Lowest'
      ? { price: 1 }
      : { price: -1 }
    : { _id: -1 };
  try {
    let products = await Product.find({
      ..._id,
      ...gender,
      ...category,
      $or: [name, brand],
    })
      .sort(sortOrder)
      .limit(limit)
      .skip(startIndex);
    if (products.length === 0)
      return res.status(200).json({ products, numProducts: 0 });
    const numProducts = await Product.countDocuments({
      ..._id,
      ...gender,
      ...category,
      $or: [name, brand],
    });
    res.status(200).json({ products, numProducts });
  } catch (error) {
    // 500: server error
    console.log(error);
    res.status(500).send({ msg: 'Server error, unable to load products.' });
  }
});

// @route GET api/products/:id
// @desc Get a product with a specific id
// @access Public
router.get('/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);
    if (!product) return res.status(404).json({ msg: 'Product not found..' });
    res.status(200).json(product);
  } catch (error) {
    // 500: server error
    res
      .status(500)
      .send({ msg: 'Unable to retrieve product details, please try again' });
  }
});

// @route POST api/products
// @desc Add a product (Only can be done by an admin).
// @access Private
router.post(
  '/',
  auth,
  admin,
  [
    check('name', 'Please include the product name')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('price', 'Please include a price (only numbers)')
      .not()
      .isEmpty()
      .isNumeric()
      .trim(),
    check('brand', 'Please include the brand').not().isEmpty().trim().escape(),
    check('category', 'Please include a category')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check(
      'stockNumber',
      'Please include the available stock number (only numbers)'
    )
      .not()
      .isEmpty()
      .isNumeric()
      .trim(),
    check('description', 'Please include a description')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('gender', "Please include the product's gender")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      brand: req.body.brand,
      category: req.body.category,
      stockNumber: req.body.stockNumber,
      description: req.body.description,
      gender: req.body.gender,
      images: [],
      rating: 0,
      numReviews: 0,
      reviews: [],
    });
    try {
      const createdProduct = await product.save();
      // send the id for image uploading purposes.
      if (!createdProduct) throw new Error('Error creating product');
      res
        .status(200)
        .json({ msg: 'Product created successfully', id: createdProduct._id });
    } catch (error) {
      // 500: server error
      res
        .status(500)
        .send({ msg: 'Server error, unable to create new product' });
    }
  }
);

// @route PUT api/products/:id
// @desc Update a product (Only can be done by an admin).
// @access Private
router.put(
  '/:id',
  auth,
  admin,
  [
    check('name', 'Please include the name of the product')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('price', 'Please include a price').not().isEmpty().trim().escape(),
    check('brand', 'Please include the brand').not().isEmpty().trim().escape(),
    check('category', 'Please include a category')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('stockNumber', 'Please include the available stock number')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('description', 'Please include a description')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('gender', "Please include the product's gender")
      .not()
      .isEmpty()
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);
    const _id = req.params.id;
    try {
      const product = await Product.findById(_id);
      product.name = req.body.name;
      product.price = req.body.price;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.stockNumber += parseInt(req.body.stockNumber);
      product.description = req.body.description;
      product.gender = req.body.gender;
      const updatedProduct = await product.save();
      if (updatedProduct)
        return res
          .status(200)
          .send({ msg: 'The product has been updated successfully' });

      throw new Error('update was unsuccessful');
    } catch (error) {
      // 500: server error
      res.status(500).send({
        msg:
          'Your request to update the product was unsuccessful, please try again',
      });
    }
  }
);

// @route delete api/products/:id
// @desc delete a product (Only can be done by an admin).
// @access Private
router.delete('/:id', auth, admin, async (req, res) => {
  const _id = req.params.id;
  try {
    const findProduct = await Product.findById(_id);
    if (!findProduct) res.status(404).json({ msg: 'Product not found' });
    await findProduct.remove();
    res.status(200).json({ msg: 'Product Deleted' });
  } catch (error) {
    res.status(500).send({
      msg: 'There was a problem deleting the desired product, please try again',
    });
  }
});

// @route post api/products/reviews/:id
// @desc Create a review of a product
// @access Private
router.post(
  '/reviews/:id',
  auth,
  [
    check('name', 'Please include your name in the review')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('rating', 'Please include your rating')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('comment', 'Please include your comment')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('title', 'Please include a title').not().isEmpty().trim().escape(),
    check('email', 'Please include your email').isEmail().normalizeEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);
    const product_id = req.params.id;
    try {
      const product = await Product.findById({ _id: product_id });
      if (!product) return res.status(404).json('Product not found');
      if (product.reviews.find((x) => x.email === req.body.email)) {
        return res.status(400).send({ msg: 'You already submitted a review' });
      }
      const review = new Review({
        name: req.body.name,
        rating: req.body.rating,
        comment: req.body.comment,
        email: req.body.email,
        title: req.body.title,
      });
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      await product.save();
      res
        .status(200)
        .json({ product, msg: 'Your review has been submitted successfully' });
    } catch (error) {
      res.status(500).send({ msg: 'server error, could not add your review' });
    }
  }
);

module.exports = router;
