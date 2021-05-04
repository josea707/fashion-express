import {
  LOAD_PRODUCTS,
  FAIL_LOADING,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_EDIT_REQUEST,
  PRODUCT_EDIT_SUCCESS,
  PRODUCT_EDIT_FAIL,
  REVIEW_SUBMIT_REQUEST,
  REVIEW_SUBMIT_SUCCESS,
  REVIEW_SUBMIT_FAIL,
  LOAD_PRODUCTS_REQUEST,
} from '../actions/types';

function productsListReducer(
  state = { products: [], loading: true, numProducts: 0 },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case LOAD_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case LOAD_PRODUCTS:
      return {
        ...state,
        loading: false,
        products: payload.products,
        numProducts: payload.numProducts,
      };
    case FAIL_LOADING:
      return {
        ...state,
        loading: false,
        products: [],
        numProducts: 0,
      };
    default:
      return state;
  }
}

function productDetailsReducer(
  state = {
    product: {},
    loading: false,
    loadingReview: false,
    loadingEdit: false,
  },
  action
) {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_DETAILS_REQUEST:
    case PRODUCT_DELETE_REQUEST:
      return { ...state, loading: true };
    case PRODUCT_EDIT_REQUEST:
      return { ...state, loadingEdit: true };
    case REVIEW_SUBMIT_REQUEST:
      return { ...state, loadingReview: true };
    case PRODUCT_DETAILS_SUCCESS:
      return { ...state, loading: false, product: payload };
    case REVIEW_SUBMIT_SUCCESS:
      return { ...state, loadingReview: false, product: payload };
    case PRODUCT_DELETE_SUCCESS:
    case PRODUCT_DETAILS_FAIL:
      return { ...state, loading: false, product: {} };
    case PRODUCT_DELETE_FAIL:
      return { ...state, loading: false };
    case PRODUCT_EDIT_FAIL:
    case PRODUCT_EDIT_SUCCESS:
      return { ...state, loadingEdit: false };
    case REVIEW_SUBMIT_FAIL:
      return { ...state, loadingReview: false };
    default:
      return state;
  }
}
export { productsListReducer, productDetailsReducer };
