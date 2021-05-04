const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, required: true },
    email: { type: String, required: true },
    title: {type: String, required: true},
    date: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [String],
  brand: { type: String, required: true },
  price: { type: Number, default: 0, required: true },
  category: { type: String, required: true },
  stockNumber: { type: Number, default: 0, required: true },
  description: { type: String, required: true },
  gender: { type: String, required: false },
  rating: { type: Number, default: 0, required: true },
  numReviews: { type: Number, default: 0, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  reviews: [ReviewSchema],
});

const Product = mongoose.model('Product', ProductSchema);
const Review = mongoose.model('Review', ReviewSchema);

module.exports = {
  Product,
  Review,
};
