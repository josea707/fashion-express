import axios from 'axios';

import {
  LOAD_PRODUCTS_REQUEST,
  LOAD_PRODUCTS,
  FAIL_LOADING,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_EDIT_SUCCESS,
  PRODUCT_EDIT_FAIL,
  REVIEW_SUBMIT_REQUEST,
  REVIEW_SUBMIT_SUCCESS,
  REVIEW_SUBMIT_FAIL,
  SET_ERROR_ALERT,
  SET_SUCCESS_ALERT,
  PRODUCT_EDIT_REQUEST,
} from './types';

// Load products
export const loadProducts = (
  { category, gender, sortOrder, searchValue, page },
  limit
) => async (dispatch) => {
  dispatch({
    type: LOAD_PRODUCTS_REQUEST,
  });
  try {
    const res = await axios.get(
      `/api/products?category=${category}&gender=${gender}&sortOrder=${sortOrder}&_id=${searchValue}&name=${searchValue}&brand=${searchValue}&page=${page}&limit=${limit}`
    );
    dispatch({
      type: LOAD_PRODUCTS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: FAIL_LOADING,
    });
  }
};

// get details of a specific product
export const detailsProduct = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAILS_REQUEST });
  try {
    const res = await axios.get('/api/products/' + id);
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: PRODUCT_DETAILS_FAIL });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// Delete a product
export const deleteProduct = (id) => async (dispatch) => {
  dispatch({
    type: PRODUCT_DELETE_REQUEST,
  });
  try {
    const res = await axios.delete(`/api/products/${id} `);
    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// Edit a product
export const editProduct = (
  id,
  { name, brand, price, category, stockNumber, description, gender, images }
) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_EDIT_REQUEST,
    });
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      name,
      brand,
      price,
      category,
      stockNumber,
      description,
      gender,
      images,
    });
    const res = await axios.put(`/api/products/${id}`, body, config);
    dispatch({
      type: PRODUCT_EDIT_SUCCESS,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_EDIT_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// submit a review
export const submitReview = (
  email,
  rating,
  title,
  name,
  comment,
  product_id
) => async (dispatch) => {
  dispatch({
    type: REVIEW_SUBMIT_REQUEST,
  });
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({
      name,
      email,
      rating,
      title,
      comment,
    });
    const res = await axios.post(
      `/api/products/reviews/${product_id}`,
      body,
      config
    );
    dispatch({
      type: REVIEW_SUBMIT_SUCCESS,
      payload: res.data.product,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
  } catch (error) {
    dispatch({
      type: REVIEW_SUBMIT_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};
