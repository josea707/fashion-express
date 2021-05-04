import {
  LOAD_CART,
  UPDATE_CART,
  CLEAR_CART,
  SAVE_SHIPPING_ADDRESS,
  SAVE_EMAIL,
} from './types';

// Load Cart

export const loadCart = () => (dispatch) => {
  if (!localStorage.cart) {
    const cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  dispatch({
    type: LOAD_CART,
    payload: JSON.parse(localStorage.getItem('cart')),
  });
};

// Add item to cart
export const addToCart = (
  _id,
  productName,
  quantity,
  images,
  price,
  stockNumber
) => (dispatch) => {
  dispatch(loadCart());
  let isThere = false;
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  cartItems.forEach((element) => {
    if (element._id === _id) {
      // verify that it's not going over the available stock
      if (parseInt(quantity) + parseInt(element.quantity) <= stockNumber)
        element.quantity = parseInt(element.quantity) + parseInt(quantity);
      element.price = price;
      isThere = true;
    }
  });
  if (!isThere || cartItems.length === 0)
    cartItems.push({ _id, productName, quantity, images, price });
  dispatch({
    type: UPDATE_CART,
    payload: cartItems,
  });
};

// update a product
export const updateCart = (_id, productName, images, price, quantity) => (
  dispatch
) => {
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  cartItems.forEach((element) => {
    if (element._id === _id) {
      element.productName = productName;
      element.images = images;
      element.price = price;
      element.quantity = quantity;
    }
  });
  dispatch({
    type: UPDATE_CART,
    payload: cartItems,
  });
};

// update the quantity of a product
export const updateQuantity = (_id, quantity) => (dispatch) => {
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  cartItems.forEach((element) => {
    if (element._id === _id) {
      element.quantity = quantity;
    }
  });
  dispatch({
    type: UPDATE_CART,
    payload: cartItems,
  });
};

// remove item from Cart

export const removeFromCart = (_id) => (dispatch) => {
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  const result = cartItems.filter((element) => element._id !== _id);
  localStorage.setItem('cart', JSON.stringify(result));
  dispatch({
    type: UPDATE_CART,
    payload: result,
  });
};

// clear cart
export const clearCart = () => (dispatch) => {
  localStorage.removeItem('cart');
  dispatch({
    type: CLEAR_CART,
  });
};

// Save shipping address at checkout

export const saveShippingAddress = (shippingAddress) => (dispatch) => {
  dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: shippingAddress });
};

export const saveEmail = (email) => (dispatch) => {
  dispatch({ type: SAVE_EMAIL, payload: email });
};
