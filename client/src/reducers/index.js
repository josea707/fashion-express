import {combineReducers} from 'redux';
import user from './user';
import {productsListReducer, productDetailsReducer} from './product';
import {orderState, ordersListState} from './order';
import alert from './alert';
import cart from './cart';
export default combineReducers({
    user,
    alert,
    productsListReducer,
    productDetailsReducer,
    cart,
    orderState,
    ordersListState
});