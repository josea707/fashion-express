const express = require('express');
const { Order } = require('../models/Order');
const { Product } = require('../models/Product');
const { User } = require('../models/User');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const config = require('config');
const { check, validationResult } = require('express-validator');
const { sendEmail } = require('../services/sendEmail');
const stripe = require('stripe')(config.get('STRIPE_SECRET_KEY'));

// @route POST api/orders
// @desc Submit an order from a user or a guest.
// @access Private
router.post(
  '/',
  [
    check('shippingAddress').not().isEmpty(),
    check('shippingAddress.firstName').not().isEmpty().trim().escape(),
    check('shippingAddress.lastName').not().isEmpty().trim().escape(),
    check('shippingAddress.address').not().isEmpty().trim().escape(),
    check('shippingAddress.city').not().isEmpty().trim().escape(),
    check('shippingAddress.postalCode').not().isEmpty().trim().escape(),
    check('shippingAddress.province').not().isEmpty().trim().escape(),
    check('items').not().isEmpty(),
    check('token').not().isEmpty(),
    check('email').isEmail().normalizeEmail(),
    check('itemsPrice').not().isEmpty().isNumeric(),
    check('taxPrice').not().isEmpty().isNumeric(),
    check('totalPrice').not().isEmpty().isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);
    const session = await mongoose.startSession();
    const order = new Order({
      shippingAddress: req.body.shippingAddress,
      items: req.body.items,
      paymentMethod: req.body.token,
      itemsPrice: req.body.itemsPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      userEmail: req.body.email,
    });
    session.startTransaction();
    try {
      const createOrder = await order.save({ session: session });

      // decrease inventory
      for (let i = 0; i < order.items.length; ++i) {
        const product = await Product.findById(order.items[i]._id).session(
          session
        );
        product.stockNumber = product.stockNumber - order.items[i].quantity;
        await product.save();
      }
      await session.commitTransaction();
      res.status(200).json(createOrder);
      sendEmail(createOrder);
    } catch (error) {
      await session.abortTransaction();
      res
        .status(500)
        .send({ msg: 'Unable to process your order, please try again.' });
    }
  }
);

// @route get api/orders
// @desc Get all orders
// @access Private by admins only
router.get('/', auth, admin, async (req, res) => {
  const page = req.query.page ? parseInt(req.query.page) : {};
  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const startIndex = req.query.page && req.query.limit ? (page - 1) * limit : 0;
  const email = req.query.email ? { userEmail: req.query.email } : {};
  try {
    const orders = await Order.find(email).limit(limit).skip(startIndex);
    const numOrders = await Order.countDocuments(email);
    res.status(200).json({ orders, numOrders });
  } catch (error) {
    res.status(500).send({
      msg: 'Server error, unable to retrieve orders from the database',
    });
  }
});

// @route get api/orders
// @desc Get somebody's order history
// @access Private
router.get('/history', auth, async (req, res) => {
  const _id = req.user.id;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  try {
    const user = await User.findById(_id).select('email');
    if (!user) {
      return res.status(401).json({ msg: 'invalid Credentials' });
    }
    const orders = await Order.find({ userEmail: user.email })
      .limit(limit)
      .skip(startIndex);
    const numOrders = await Order.countDocuments({ userEmail: user.email });
    res.status(200).json({ orders, numOrders });
  } catch (error) {
    res.status(500).send({
      msg: 'Server error, your request could`nt be made successfully',
    });
  }
});

// @route get api/orders/history/order_id
// @desc Get a specific order.
// @access Private
router.get('/history/:order_id', auth, async (req, res) => {
  const _id = req.params.order_id;
  try {
    const order = await Order.findById(_id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).send({
      msg: 'Server error, your request did not go through!. Please try again',
    });
  }
});

// @route put api/orders/admins/:id
// @desc Modify a specific order (only can be made by an admin).
// @access Private
router.get('/admins/:order_id', auth, admin, async (req, res) => {
  const _id = req.params.order_id;
  try {
    const order = await Order.findById(_id);
    if (!order) return res.status(404).json('Order not found');
    res.status(200).json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      msg:
        "Your request to obtain the order's details was unsuccessful, please try again",
    });
  }
});

// @route PUT api/orders/admins/charge/:id
// @desc Charge the customer and ship the order
// @access Private
router.put('/admins/charge/:id', auth, admin, async (req, res) => {
  const _id = req.params.id;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const order = await Order.findById(_id).session(session);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    // charge customer
    const charge = await stripe.charges.create({
      amount: parseInt(100 * order.totalPrice),
      currency: 'cad',
      source: 'tok_visa',
      receipt_email: order.userEmail,
    });
    // update order
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();
    await session.commitTransaction();
    res
      .status(200)
      .json({ order, msg: 'The order has been charged successfully' });
  } catch (error) {
    await session.abortTransaction();
    // 500: server error
    res.status(500).send({
      msg:
        'There was an issue charging the specified payment method, Please try again',
    });
  }
});

// @route PUT api/orders/admins/deliver/:id
// @desc update the delivered status of an order
// @access Private
router.put('/admins/deliver/:id', auth, admin, async (req, res) => {
  const _id = req.params.id;
  try {
    const order = await Order.findById(_id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();
    res
      .status(200)
      .json({ order, msg: 'The order has been delivered successfully' });
  } catch (error) {
    // 500: server error
    res.status(500).send({
      msg: 'There was an issue updating the product, please try again',
    });
  }
});

module.exports = router;
