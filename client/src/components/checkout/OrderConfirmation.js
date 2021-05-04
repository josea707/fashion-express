import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { formatDateAndTime } from '../../utils/formatDate';
import PropTypes from 'prop-types';
const OrderConfirmation = ({ order }) => {
  if (Object.keys(order).length === 0)
    return <Redirect to='/checkout/payment' />;
  const {
    _id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    totalPrice,
    userEmail,
    createdAt,
  } = order;
  const { address, city, postalCode, province } = shippingAddress;
  return (
    <div className='margin-container'>
      <div>
        <h2> Thanks for your order</h2>
        <h4> We're processing your order now, here are the details</h4>
      </div>
      <div>
        <p> Confirmation will be sent to: {userEmail}</p>
        <p> Order number: {_id} </p>
        <p> Order date: {formatDateAndTime(createdAt)} </p>
        <p>
          {' '}
          Delivery details: {address}, {city} {province}. Postal Code:{' '}
          {postalCode}
        </p>
      </div>
      <div>
        <p> Total before HST: ${itemsPrice.toFixed(2)} </p>
        <p>
          {' '}
          HST ({province}): ${taxPrice.toFixed(2)}
        </p>
        <p> Total: ${totalPrice} </p>
      </div>
      <div>
        <p>
          {' '}
          Paid with Debit/Credit card ************{paymentMethod.card.last4}
        </p>
      </div>
    </div>
  );
};

OrderConfirmation.propTypes = {
  order: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  order: state.orderState.order,
});

export default connect(mapStateToProps, {})(OrderConfirmation);
