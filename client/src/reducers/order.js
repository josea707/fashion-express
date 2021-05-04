import {
  ORDER_SUBMIT_REQUEST,
  ORDER_SUBMIT_SUCCESS,
  ORDER_SUBMIT_FAIL,
  ORDERS_LOADING_REQUEST,
  ORDERS_LOADING_SUCCESS,
  ORDERS_LOADING_FAIL,
  ORDER_LOADING_SUCCESS,
  ORDER_LOADING_FAIL,
  ORDER_LOADING_REQUEST,
  ORDER_CLEAR,
  ORDER_CHARGE_REQUEST,
  ORDER_CHARGE_FAIL,
  ORDER_CHARGE_SUCCESS,
  ORDER_SEARCH_REQUEST,
  ORDER_SEARCH_SUCCESS,
  ORDER_SEARCH_FAIL,
  ORDER_DELIVERED_SUCCESS,
  ORDER_DELIVERED_REQUEST,
  ORDER_DELIVERED_FAIL,
  LOGOUT,
} from '../actions/types';

const INITIAL_STATE_LIST = {
  orders: [],
  loading: true,
  numOrders: 0,
};
const INITIAL_STATE_ORDER = {
  order: {},
  loading: false,
};
function ordersListState(state = INITIAL_STATE_LIST, action) {
  const { type, payload } = action;
  switch (type) {
    case ORDERS_LOADING_REQUEST:
    case ORDER_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ORDERS_LOADING_SUCCESS:
    case ORDER_SEARCH_SUCCESS:
      return {
        ...state,
        orders: payload.orders,
        numOrders: payload.numOrders,
        loading: false,
      };
    case ORDERS_LOADING_FAIL:
    case ORDER_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        orders: [],
      };
    case LOGOUT:
      return INITIAL_STATE_LIST;
    default:
      return state;
  }
}

function orderState(state = INITIAL_STATE_ORDER, action) {
  const { type, payload } = action;
  switch (type) {
    case ORDER_SUBMIT_REQUEST:
    case ORDER_LOADING_REQUEST:
    case ORDER_CHARGE_REQUEST:
    case ORDER_DELIVERED_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ORDER_SUBMIT_SUCCESS:
    case ORDER_LOADING_SUCCESS:
    case ORDER_CHARGE_SUCCESS:
    case ORDER_DELIVERED_SUCCESS:
      return {
        ...state,
        order: payload,
        loading: false,
      };
    case ORDER_LOADING_FAIL:
    case ORDER_SUBMIT_FAIL:
    case ORDER_CHARGE_FAIL:
    case ORDER_DELIVERED_FAIL:
      return {
        ...state,
        loading: false,
      };
    case ORDER_CLEAR:
      return {
        loading: false,
        order: {},
      };
    case LOGOUT:
      return INITIAL_STATE_ORDER;
    default:
      return state;
  }
}

export { orderState, ordersListState };
