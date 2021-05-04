import {
  CLEAR_ALL_ALERTS,
  SET_ERROR_ALERT,
  SET_SUCCESS_ALERT,
} from '../actions/types';

const initialState = { isError: false, msg: '', isSuccess: false };

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ERROR_ALERT:
      return {
        msg: payload,
        isError: true,
        isSuccess: false
      };
    case SET_SUCCESS_ALERT:
      return {
        isError: false,
        msg: payload,
        isSuccess: true,
      };
    case CLEAR_ALL_ALERTS:
      return {
        msg: '',
        isError: false,
        isSuccess: false,
      };
    default:
      return state;
  }
}
