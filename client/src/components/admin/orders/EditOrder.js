import React, { useEffect, useState, Fragment } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import {
  getOrderAdmin,
  chargeOrder,
  deliverOrder,
} from '../../../actions/order';
import Spinner from '../../layout/Spinner';
import CartItem from '../../checkout/CartItem';
import { ReactComponent as CloseMenu } from '../../../assets/SVGs/x.svg';
import MessageBox from '../../layout/MessageBox';
import { clearAlert } from '../../../actions/alert';
import { formatDateAndTime } from '../../../utils/formatDate';
const EditOrder = ({
  orderState: { order, loading },
  getOrderAdmin,
  chargeOrder,
  deliverOrder,
  clearAlert,
  alert: { isError, isSuccess, msg },
}) => {
  const { id } = useParams();
  useEffect(() => {
    getOrderAdmin(id);
    clearAlert();
    // eslint-disable-next-line
  }, []);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
    clearAlert();
  };
  useEffect(() => {
    if (isSuccess || isError) closeModalWithTimer();
    // eslint-disable-next-line
  }, [isSuccess, isError]);
  const closeModalWithTimer = () => {
    setTimeout(function () {
      setModalIsOpenToFalse();
    }, 4000);
  };
  const handleChargeOrder = () => {
    chargeOrder(id);
  };
  const handleDeliverOrder = () => {
    deliverOrder(id);
  };
  const displayError = () => {
    return (
      <div className='delete-modal__confirmation'>
        <MessageBox type={'danger'} msg={msg} />
      </div>
    );
  };
  const displaySuccess = () => {
    return (
      <div className='delete-modal__confirmation'>
        <MessageBox type={'success1'} msg={msg} />
        Closing the window...
      </div>
    );
  };
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        className='modal-container'
        ariaHideApp={false}
      >
        <button onClick={setModalIsOpenToFalse} className='button-delete'>
          <CloseMenu className='menu-icon delete-x' />
        </button>
        {loading ? (
          <div className='modal-container__confirmation'>
            {' '}
            <Spinner />
          </div>
        ) : (
          <div className='modal-container__confirmation'>
            {!order.isPaid ? (
              <Fragment>
                {' '}
                {isError && displayError()}
                {isSuccess && displaySuccess()}
                {!isError && !isSuccess && (
                  <Fragment>
                    <p> Click on confirm to charge this order</p>
                    <div className='modal-container__confirmation--button'>
                      <button
                        onClick={handleChargeOrder}
                        className='btn btn-primary'
                      >
                        {' '}
                        Confirm
                      </button>
                    </div>
                  </Fragment>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {' '}
                {isError && displayError()}
                {isSuccess && displaySuccess()}
                {!isError && !isSuccess && (
                  <Fragment>
                    <p>
                      {' '}
                      Do you wish to change the delivery status of this order?
                    </p>
                    <div className='modal-container__confirmation--button'>
                      <button
                        onClick={handleDeliverOrder}
                        className='btn btn-primary'
                      >
                        {' '}
                        Deliver
                      </button>
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
        )}
      </Modal>
      {loading || Object.keys(order).length === 0 || id !== order._id ? (
        <Spinner />
      ) : (
        <div className='order-container row top'>
          <div className='order-container__information'>
            <div className='order-container__information--shipping'>
              <p> Email: {order.userEmail}</p>
              <p>
                {' '}
                Name:{' '}
                {order.shippingAddress.firstName +
                  ' ' +
                  order.shippingAddress.lastName}
              </p>
              <p>
                {' '}
                Address: {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.province},{' '}
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
            <p> Total Price: ${order.totalPrice}</p>{' '}
            {order.isPaid ? (
              <p className='success'>Paid</p>
            ) : (
              <button
                onClick={(e) => {
                  setModalIsOpen(true);
                }}
                className='btn btn-primary'
              >
                {' '}
                Ship order
              </button>
            )}{' '}
            {order.isDelivered ? (
              <p className='success'> Order Delivered</p>
            ) : (
              <Fragment>
                {!order.isPaid ? (
                  <p> Order not Delivered</p>
                ) : (
                  <button
                    onClick={(e) => {
                      setModalIsOpen(true);
                      clearAlert();
                    }}
                    className='btn btn-primary'
                  >
                    {' '}
                    Deliver Order
                  </button>
                )}
              </Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
EditOrder.propTypes = {
  getOrderAdmin: PropTypes.func.isRequired,
  chargeOrder: PropTypes.func.isRequired,
  deliverOrder: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  orderState: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  orderState: state.orderState,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  getOrderAdmin,
  chargeOrder,
  deliverOrder,
  clearAlert,
})(EditOrder);
