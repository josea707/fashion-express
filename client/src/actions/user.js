import axios from 'axios';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  PROFILE_EDIT_SUCCESS,
  PROFILE_EDIT_FAIL,
  PROFILE_EDIT_REQUEST,
  PASSWORD_EDIT_REQUEST,
  PASSWORD_EDIT_SUCCESS,
  PASSWORD_EDIT_FAIL,
  DELETE_PROFILE_SUCCESS,
  DELETE_PROFILE_FAIL,
  DELETE_PROFILE_REQUEST,
  SET_ERROR_ALERT,
  SET_SUCCESS_ALERT,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
} from './types';
import setToken from '../utils/setAuthToken';

// Load User

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  dispatch({
    type: LOGIN_REQUEST,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

//logout: Eliminate all sensitive info too like orders and order state.

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};

// Register a new user
export const register = ({ firstName, lastName, email, password }) => async (
  dispatch
) => {
  dispatch({
    type: REGISTER_REQUEST,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ firstName, lastName, email, password });
  try {
    const res = await axios.post('/api/users', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// Edit the personal info of a user
export const editUser = ({
  firstName,
  lastName,
  address,
  city,
  postalCode,
  province,
  phoneNumber,
}) => async (dispatch) => {
  dispatch({
    type: PROFILE_EDIT_REQUEST,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phoneNumber,
  });
  try {
    const res = await axios.put(`/api/users`, body, config);
    dispatch({
      type: PROFILE_EDIT_SUCCESS,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
    dispatch(loadUser());
  } catch (error) {
    dispatch({
      type: PROFILE_EDIT_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// Delete User

export const deleteAccount = () => async (dispatch) => {
  dispatch({
    type: DELETE_PROFILE_REQUEST,
  });
  try {
    const res = await axios.delete('/api/users');
    dispatch({
      type: DELETE_PROFILE_SUCCESS,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
  } catch (error) {
    dispatch({
      type: DELETE_PROFILE_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};

// Change Password

export const changePassword = (
  { currentPassword, newPassword1, newPassword2 },
  id
) => async (dispatch) => {
  dispatch({
    type: PASSWORD_EDIT_REQUEST,
  });
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ currentPassword, newPassword1, newPassword2 });
  try {
    const res = await axios.put(`/api/users/passwords`, body, config);
    dispatch({
      type: PASSWORD_EDIT_SUCCESS,
    });
    dispatch({
      type: SET_SUCCESS_ALERT,
      payload: res.data.msg,
    });
  } catch (error) {
    dispatch({
      type: PASSWORD_EDIT_FAIL,
    });
    dispatch({
      type: SET_ERROR_ALERT,
      payload: error.response.data.msg,
    });
  }
};
