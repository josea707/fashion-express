import axios from 'axios';

import {
  ORDER_SUBMIT_REQUEST,
  ORDER_SUBMIT_SUCCESS,
  ORDER_SUBMIT_FAIL,
  ORDERS_LOADING_SUCCESS,
  ORDERS_LOADING_REQUEST,
  ORDERS_LOADING_FAIL,
  ORDER_LOADING_SUCCESS,
  ORDER_LOADING_REQUEST,
  ORDER_LOADING_FAIL,
  ORDER_CLEAR,
  ORDER_CHARGE_REQUEST,
  ORDER_CHARGE_FAIL,
  ORDER_CHARGE_SUCCESS,
  SET_ERROR_ALERT,
  SET_SUCCESS_ALERT,
  ORDER_DELIVERED_REQUEST,
  ORDER_DELIVERED_SUCCESS,
  ORDER_DELIVERED_FAIL,
} from './types';

// charge an order and ship it
export const chargeOrder = (order_id) => async (dispatch) => {
  dispatch({
    type: ORDER_CHARGE_REQUEST,
  });
  try {
    const res = await axios.put(`/api/orders/admins/charge/${order_id}`);
    dispatch({
      type: ORDER_CHARGE_SUCCESS,
      payload: res.data.order,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CHARGE_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};
//  Make the order delivery status true
export const deliverOrder = (order_id) => async (dispatch) => {
  dispatch({
    type: ORDER_DELIVERED_REQUEST,
  });
  try {
    const res = await axios.put(`/api/orders/admins/deliver/${order_id}`);
    dispatch({
      type: ORDER_DELIVERED_SUCCESS,
      payload: res.data.order,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DELIVERED_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// get any order (only an admin has access to this)
export const getOrderAdmin = (order_id) => async (dispatch) => {
  dispatch({
    type: ORDER_LOADING_REQUEST,
  });
  try {
    const res = await axios.get(`/api/orders/admins/${order_id}`);
    dispatch({
      type: ORDER_LOADING_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LOADING_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// get all orders available (only admin has access to this)
export const getAllOrders = (page, limit, email) => async (dispatch) => {
  dispatch({
    type: ORDERS_LOADING_REQUEST,
  });
  try {
    const res = await axios.get(
      `/api/orders?page=${page}&limit=${limit}&email=${email}`
    );
    dispatch({
      type: ORDERS_LOADING_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ORDERS_LOADING_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// get a specific order info of a user
export const getOrder = (order_id) => async (dispatch) => {
  dispatch({
    type: ORDER_LOADING_REQUEST,
  });
  try {
    const res = await axios.get(`/api/orders/history/${order_id}`);
    dispatch({
      type: ORDER_LOADING_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LOADING_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// clear order
export const clearOrder = () => async (dispatch) => {
  dispatch({
    type: ORDER_CLEAR,
  });
};

// get the history of orders made by a user
export const getOrders = (page, limit) => async (dispatch) => {
  dispatch({
    type: ORDERS_LOADING_REQUEST,
  });
  try {
    const res = await axios.get(
      `/api/orders/history?page=${page}&limit=${limit}`
    );
    dispatch({
      type: ORDERS_LOADING_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ORDERS_LOADING_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// Submit an order
export const submitOrder = (
  email,
  token,
  items,
  shippingAddress,
  itemsPrice,
  taxPrice,
  totalPrice
) => async (dispatch) => {
  dispatch({
    type: ORDER_SUBMIT_REQUEST,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    email,
    token,
    items,
    shippingAddress,
    itemsPrice,
    taxPrice,
    totalPrice,
  });
  try {
    const res = await axios.post(`/api/orders`, body, config);
    dispatch({
      type: ORDER_SUBMIT_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_SUBMIT_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};
