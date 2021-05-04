const express = require('express');
const router = express.Router();
const { check, validationResult, query } = require('express-validator');
const { User, PersonalInfo } = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');

// @route GET api/users/email?
// @desc Verify if the email is taken by a user
// @access Public
router.get(
  '/email',
  [query('address', 'Please include a valid email').isEmail().normalizeEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);
    const email = req.query.address;
    try {
      const user = await User.find({ email });
      // if no user found with the specified email, the length of the array user will be 0.
      if (user.length !== 0)
        return res.status(400).json({
          msg: 'The email is taken, please sign in with your credentials.',
          isTaken: true,
        });
      res.status(200).json({
        msg: 'The email is not taken, you may continue.',
        isTaken: false,
      });
    } catch (error) {
      res
        .status(500)
        .send({ msg: 'Server Error, could not validate your email' });
    }
  }
);
// @route POST api/users
// @desc Register a new user
// @access Public
router.post(
  '/',
  [
    check('firstName', 'Please add your first name')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('lastName', 'Please add your last name')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a password with 6 >= characters')
      .isLength({
        min: 6,
      })
      .trim()
      .escape(),
  ],
  async (req, res) => {
    // only do it for routes that accept data and need validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);

    // destructure
    const { firstName, lastName, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) return res.status(409).json({ msg: 'User already exists' });
      // create new User
      const personalInformation = new PersonalInfo();
      user = new User({
        firstName,
        lastName,
        email,
        password,
        personalInformation,
      });
      // hash password
      const salt = await bcrypt.genSalt(10);
      // Hash password: takes the password and sault as parameters
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      // don't need an expire but it is preferred. Can be saved in a redis db to verify expiration
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (error) {
      res
        .status(500)
        .send({ msg: 'Account registration failed, please try again' });
    }
  }
);

// @route Put api/users
// @desc Update user info
// @access Private -> Needs authorization
router.put(
  '/',
  auth,
  [
    check('firstName', 'Please add your first name')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('lastName', 'Please add your last name')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    check('phoneNumber').trim().escape(),
    check('address').trim().escape(),
    check('city').trim().escape(),
    check('postalCode').trim().escape(),
    check('province').trim().escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      postalCode,
      province,
    } = req.body;
    // build customer object
    const customerInfo = {
      firstName,
      lastName,
      personalInformation: { address, city, postalCode, province, phoneNumber },
    };
    try {
      let user = await User.findById({ _id: req.user.id });
      if (!user) return res.status(404).json({ msg: 'User not found' });
      user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $set: customerInfo,
        },
        { new: true }
      );
      if (!user) throw new Error("Unable to update user's info");
      res.status(200).json({
        msg: "The user's personal information has been updated successfully",
      });
    } catch (error) {
      res.status(500).send({
        msg:
          'Your request to update your personal information was unsuccessful',
      });
    }
  }
);

// @route Delete api/users
// @desc Delete your account
// @access Private -> Needs authorization
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user.id });
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const result = await User.findByIdAndRemove(req.user.id);
    if (!result) throw new Error('Unable to delete your account');
    res.status(200).json({ msg: 'Your account has been deleted successfully' });
  } catch (error) {
    res.status(500).send({
      msg:
        'Your request to delete your account was unsuccessful, please try again',
    });
  }
});

// @route Put api/users/passwords
// @desc Update user's password
// @access Private -> Needs authorization
router.put(
  '/passwords',
  [
    check('newPassword1', 'Please enter a valid password with 6 >= characters')
      .isLength({
        min: 6,
      })
      .trim()
      .escape(),
    check('newPassword2', 'Please enter a valid password with 6 >= characters')
      .isLength({
        min: 6,
      })
      .trim()
      .escape(),
    check(
      'currentPassword',
      'Please enter a valid password with 6 >= characters'
    )
      .isLength({
        min: 6,
      })
      .trim()
      .escape(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);
    const { currentPassword, newPassword1, newPassword2 } = req.body;
    try {
      let user = await User.findById({ _id: req.user.id });
      if (!user) return res.status(404).json({ msg: 'User not found' });
      // bcrypt compare method
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
      if (newPassword1 != newPassword2)
        return res.status(400).json({ msg: 'Passwords do not match' });
      // salt: encrypt the password. 10 is the default
      const salt = await bcrypt.genSalt(10);
      // Hash password: takes the password and sault as parameters
      const newPassword = await bcrypt.hash(newPassword1, salt);
      user = await User.findByIdAndUpdate(
        { _id: req.user.id },
        {
          $set: { password: newPassword },
        },
        { new: true }
      );
      if (!user) throw new Error('Unable to update your account');
      res
        .status(200)
        .json({ msg: "User's password has been updated successfully" });
    } catch (error) {
      res
        .status(500)
        .send({ msg: "Couldn't update user's password, please try again" });
    }
  }
);

module.exports = router;
