const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/User');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// @route GET api/auth
// @desc Get logged in user
// @access Private
// when we need to protect route -> Bring our middleware.
router.get('/', auth, async (req, res) => {
  try {
    // select everything but the password
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(400).json({ msg: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send({ msg: 'Server Error, could not validate your credentials' });
  }
});

// @route POST api/auth
// @desc Auth user & get Token
// @access Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Please enter a valid password')
      .exists()
      .isLength({
        min: 6,
      })
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0]);

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'invalid Credentials' });
      // bcrypt compare method
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });
      // send user id, firstName, and admin.
      const payload = {
        user: {
          id: user.id,
        },
      };
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
        .send({ msg: "The server could'nt process your login request" });
    }
  }
);

module.exports = router;
