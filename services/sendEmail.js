const nodemailer = require('nodemailer');
const config = require('config');
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: config.get('email'),
    pass: config.get('emailPassword'),
  },
});

const sendConfirmationEmail = async (order) => {
  const options = {
    from: config.get('email'),
    to: order.userEmail,
    subject: `We've received your order #${order._id}`,
    html: `
    <h1> Hello ${order.shippingAddress.firstName}</h1>
    <p> Thank you for shopping at Fashion Express, we've received your order.</p>
    <p> Order Number: ${order._id}</p>
    <br>
    <p> Subtotal: $${order.itemsPrice} </p>
    <p> HST: $${order.taxPrice} </p>
    <p> Total: $${order.totalPrice} </p>
    <p> Paid with XXXX-XXXX-XXXX-${order.paymentMethod.card.last4}</p>
    <br> 
    <h3> Shipping Address </h3>
    <p>${order.shippingAddress.address} </p>
    <p>${order.shippingAddress.city} </p>
    <p>${order.shippingAddress.province} </p>
    <p>${order.shippingAddress.postalCode} </p>
    `,
  };
  transporter.sendMail(options, function (err, info) {
    if (err) console.log(info);
    return;
  });
};

exports.sendEmail = sendConfirmationEmail;
