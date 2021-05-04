import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CartItem from './CartItem';
import Spinner from '../layout/Spinner';
const Cart = ({ cart: { cart }, history }) => {
  // count is used to hide everything until all items have been updated
  const [count, setCount] = useState(0);
  const checkOutHandler = () => {
    cart.length > 0 && history.push('/checkout/shipping');
  };
  const incrementCount = () => {
    setCount((count) => ++count);
  };
  const decrementCount = () => {
    setCount((count) => --count);
  };
  return (
    <div className='shopping-container'>
      <h3 className='cart-container__items'>YOUR CART : ({cart.length})</h3>
      <div className='cart-container__list'>
        {cart.map((product) => (
          <CartItem
            p={product}
            key={product._id}
            incrementCount={incrementCount}
            decrementCount={decrementCount}
          />
        ))}
      </div>
      {count !== cart.length ? (
        <Spinner />
      ) : (
        <div className='cart-container__checkout'>
          <h3>
            Subtotal ${' '}
            {cart.reduce((a, c) => a + c.price * c.quantity, 0).toFixed(2)}
          </h3>
          <p> Shipping and taxes calculated at checkout</p>
          <button
            onClick={checkOutHandler}
            className='btn btn-dark light'
            disabled={cart.length === 0}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};
Cart.propTypes = {
  cart: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});
export default connect(mapStateToProps)(Cart);
