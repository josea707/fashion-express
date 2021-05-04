import React, { useState, useEffect } from 'react';
import Steps from './Steps';
import CartItem from './CartItem';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Checkout from './Checkout';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import getProvinceTax from '../../utils/getProvinceTax';
import { submitOrder } from '../../actions/order';
import { clearCart } from '../../actions/cart';
import PropTypes from 'prop-types';
import { clearAlert, setError } from '../../actions/alert';
import LoadingForm from '../layout/LoadingForm';
import MessageBox from '../layout/MessageBox';
const stripe = loadStripe(process.env.REACT_APP_STRIPE_KEY);
const Submit = ({
  cart: { cart, shippingAddress, email },
  submitOrder,
  history,
  orderState: { loading, order },
  clearCart,
  clearAlert,
  setError,
  alert: { isError, msg },
}) => {
  useEffect(() => {
    clearAlert();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    // if true => order has been submitted successfully, continue to the confirmation screen.
    if (Object.keys(order).length > 0 && !loading) {
      clearCart();
      history.push('/checkout/confirmation');
    }
    // eslint-disable-next-line
  }, [order]);

  const [card, saveCard] = useState();
  const totalPriceBeforeTax = cart.reduce(
    (a, c) => a + c.quantity * c.price,
    0
  );

  const tax = getProvinceTax(shippingAddress.province);
  const taxMoney = totalPriceBeforeTax * (tax / 100);
  const finalPrice = (totalPriceBeforeTax + taxMoney).toFixed(2);
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phoneNumber,
  } = shippingAddress;

  const handleSubmit = () => {
    !card
      ? setError('Please provide a payment method')
      : submitOrder(
          email,
          card,
          cart,
          shippingAddress,
          totalPriceBeforeTax.toFixed(2),
          taxMoney.toFixed(2),
          finalPrice
        );
  };
  // if no email and not complete shipping address => go back to shipping page.
  if (Object.keys(shippingAddress).length < 7 || email === '') {
    return <Redirect to='/checkout/shipping' />;
  }
  return (
    <div>
      <Steps stepOne stepTwo />
      <div className='row top order-container'>
        <div className='order-container__information'>
          <div className='order-container__information--shipping'>
            <p>
              {' '}
              Name: {firstName} {lastName}
            </p>
            <p>
              {' '}
              Address: {address}, {city}, {province}, {postalCode}
            </p>
            <p> Phone Number: {phoneNumber}</p>
          </div>
          <div className='order-container__information--payment'>
            <Elements stripe={stripe}>
              <Checkout saveCard={saveCard} />
            </Elements>
          </div>
          <div className='cart-container__list'>
            {cart.map((product) => (
              <CartItem p={product} disableOptions={true} key={product._id} />
            ))}
          </div>
        </div>
        <div className='order-container__total'>
          <p> Price: ${totalPriceBeforeTax.toFixed(2)}</p>
          <p>
            {' '}
            HST: ${taxMoney.toFixed(2)} (%{tax} {province})
          </p>
          <p> Total Price: ${finalPrice}</p>
          {loading && (
            <div className='order-container__loading'>
              <LoadingForm />{' '}
            </div>
          )}
          {isError && !loading && <MessageBox type={'danger'} msg={msg} />}
          <button className='btn btn-primary light' onClick={handleSubmit}>
            {' '}
            Place Order{' '}
          </button>
        </div>
      </div>
    </div>
  );
};

Submit.propTypes = {
  submitOrder: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  orderState: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  orderState: state.orderState,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  submitOrder,
  clearCart,
  clearAlert,
  setError,
})(Submit);
