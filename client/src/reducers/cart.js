import {
  LOAD_CART,
  UPDATE_CART,
  SAVE_SHIPPING_ADDRESS,
  SAVE_EMAIL,
  CLEAR_CART,
} from '../actions/types';

// token goes to local storage.
const initialState = {
  cart: [],
  shippingAddress: {},
  email: '',
  loading: true,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CART:
      return {
        ...state,
        cart: payload,
      };
    case UPDATE_CART:
      localStorage.setItem('cart', JSON.stringify(payload));
      return {
        ...state,
        cart: payload,
      };
    case SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: payload,
      };
    case SAVE_EMAIL:
      return {
        ...state,
        email: payload,
      };
    case CLEAR_CART:
      return {
        cart: [],
        shippingAddress: {},
        email: '',
        loading: true,
      };
    default:
      return state;
  }
}
