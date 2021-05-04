const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      province: { type: String, required: true },
    },
    items: [
      {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        images: [{ type: String, required: true }],
        price: { type: Number, required: true },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product',
          required: true,
        },
      },
    ],
    paymentMethod: { type: Object, required: true },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    userEmail: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = {
    Order
  };
