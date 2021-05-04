import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
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
  LOGIN_REQUEST,
  REGISTER_REQUEST,
} from '../actions/types';

// token goes to local storage.
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: false,
  user: null,
  isAdmin: false,
  isError: false,
  errorMessage: '',
  successMessage: '',
  personalInfo: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        isAdmin: payload.isAdmin,
      };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: true,
      };
    case PROFILE_EDIT_SUCCESS:
    case PASSWORD_EDIT_SUCCESS:
    case DELETE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      return initialState;
    case PROFILE_EDIT_FAIL:
    case PASSWORD_EDIT_FAIL:
    case DELETE_PROFILE_FAIL:
    case REGISTER_FAIL:
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
      };
    case DELETE_PROFILE_REQUEST:
    case PROFILE_EDIT_REQUEST:
    case PASSWORD_EDIT_REQUEST:
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
