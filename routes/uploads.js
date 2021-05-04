const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { uploadImage } = require('../services/uploadImage');
const { Product } = require('../models/Product');
// @route POST api/uploads/:id
// @desc upload an image and save the URL from amazon.
// @access Private
router.post('/:id', auth, admin, uploadImage.single('image'), (req, res) => {
  const _id = req.params.id;
  uploadImage.single('name')(req, res, async function (error) {
    if (error) {
      return res.status(500).json({ msg: 'Error uploading images' });
    }
    try {
      const product = await Product.findById(_id);
      if (!product) res.status(404).json({ msg: 'Product not found' });
      const { images } = product;
      images.push(req.file.location);
      const updatedProduct = await product.save();
      if (updatedProduct)
        return res.status(200).json({ msg: 'Images added successfully' });
    } catch (error) {
      res
        .status(500)
        .json({ msg: 'Unable to update images, please try again!' });
    }
  });
});

module.exports = router;
