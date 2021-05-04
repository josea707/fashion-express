import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeFromCart, updateCart, updateQuantity } from '../../actions/cart';
import { ReactComponent as CloseMenu } from '../../assets/SVGs/x.svg';
import axios from 'axios';
const CartItem = ({
  p: { _id, productName, price, quantity, images },
  removeFromCart,
  updateQuantity,
  disableOptions,
  updateCart,
  incrementCount,
  decrementCount,
}) => {
  // make it work like componentDidUpdate
  // disable options allow other components to load this component when no update is necessary
  const didMountRef = useRef(false);
  const [product, setProduct] = useState({});
  useEffect(() => {
    if (didMountRef.current) {
      if (!disableOptions)
        updateCart(
          product._id,
          product.name,
          product.images,
          product.price,
          product.stockNumber < quantity ? 1 : quantity
        );
      incrementCount();
    } else didMountRef.current = true;
    // eslint-disable-next-line
  }, [product]);
  useEffect(() => {
    if (!disableOptions) updateProduct(_id);
    // eslint-disable-next-line
  }, []);
  const [qnty, setQnty] = useState(quantity);
  // need to update each product individually. Not done in the reducer cause it would end up
  // making product object the same for all CartItem components.
  const updateProduct = async (id) => {
    try {
      const res = await axios.get('/api/products/' + id);
      setProduct(res.data);
    } catch (error) {
      console.log('error updating');
    }
  };
  const setQuantity = (e) => {
    setQnty(e.target.value);
    updateQuantity(_id, e.target.value);
  };
  const removeFromCartAndDecrement = () => {
    removeFromCart(_id);
    decrementCount();
  };
  return (
    <div>
      {(Object.keys(product).length > 0 || disableOptions) && (
        <div className='cart-item row'>
          <div className='cart-item__element'>
            {' '}
            <img className='small' src={images[0]} alt={productName}></img>
          </div>
          <div className='cart-item__element'> {productName}</div>
          <div className='cart-item__element'> ${price}</div>
          {!disableOptions && (
            <div className='cart-item__quantity'>
              <select
                value={qnty}
                onChange={setQuantity}
                className='select-options'
              >
                {[...Array(product.stockNumber).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
              {!disableOptions && (
                <button
                  className='btn'
                  onClick={() => removeFromCartAndDecrement()}
                >
                  {' '}
                  <CloseMenu className='' />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

CartItem.propTypes = {
  p: PropTypes.object.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateCart: PropTypes.func.isRequired,
  disableOptions: PropTypes.bool,
  updateQuantity: PropTypes.func.isRequired,
  incrementCount: PropTypes.func,
};

export default connect(undefined, {
  removeFromCart,
  updateQuantity,
  updateCart,
})(CartItem);
