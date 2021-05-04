import {
    CLEAR_ALL_ALERTS,
    SET_ERROR_ALERT,
    SET_SUCCESS_ALERT
} from './types';

export const setError = (msg) => dispatch => {
    dispatch({
        type: SET_ERROR_ALERT,
        payload: msg
    });
};


export const setSuccess = (msg) => dispatch => {
    dispatch({
        type: SET_SUCCESS_ALERT,
        payload: msg
    });
};
export const clearAlert = () => dispatch => {
    dispatch({
        type: CLEAR_ALL_ALERTS,
    });
}


