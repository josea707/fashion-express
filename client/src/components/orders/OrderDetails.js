import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import { getOrder } from '../../actions/order';
import Spinner from '../layout/Spinner';
import CartItem from '../checkout/CartItem';
import { clearAlert } from '../../actions/alert';
import { formatDateAndTime } from '../../utils/formatDate';
import MessageBox from '../layout/MessageBox';
const OrderDetails = ({
  orderState: { order, loading },
  getOrder,
  alert: { isError, msg },
  clearAlert,
}) => {
  const { order_id } = useParams();
  useEffect(() => {
    clearAlert();
    getOrder(order_id);
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className='order-container row top'>
          {isError && <MessageBox type={'danger'} msg={msg} />}
          {Object.keys(order).length > 0 && (
            <Fragment>
              <div className='order-container__information'>
                <div className='order-container__information--shipping'>
                  <p> Email: {order.userEmail}</p>
                  <p>
                    {' '}
                    Name: {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>
                    {' '}
                    Address: {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city},{' '}
                    {order.shippingAddress.province},{' '}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>
                <div className='order-container__information--payment'>
                  <p> Payment Method: {order.paymentMethod.card.last4}</p>
                  <p> Order placed on: {formatDateAndTime(order.createdAt)} </p>
                </div>
                <div className='cart-container__list'>
                  {order.items.map((product) => (
                    <CartItem
                      p={product}
                      disableOptions={true}
                      key={product._id}
                      noUpdate={true}
                    />
                  ))}
                </div>
              </div>
              <div className='order-container__total'>
                <p> Price: ${order.itemsPrice.toFixed(2)}</p>
                <p> Taxes: ${order.taxPrice.toFixed(2)}</p>
                <p> Total Price: ${order.totalPrice}</p>
                <p> {order.isPaid ? 'Paid' : 'Not charged yet'}</p>
                <p>
                  {' '}
                  {order.isDelivered
                    ? 'Order Delivered'
                    : 'Order Not delivered yet'}
                </p>
              </div>
            </Fragment>
          )}
        </div>
      )}
    </div>
  );
};
OrderDetails.propTypes = {
  getOrder: PropTypes.func.isRequired,
  orderState: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  orderState: state.orderState,
  alert: state.alert,
});

export default connect(mapStateToProps, { getOrder, clearAlert })(OrderDetails);
