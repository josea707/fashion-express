import React from 'react';
import CartItem from '../checkout/CartItem';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate';
import PropTypes from 'prop-types';
const OrderHistoryItem = ({ order }) => {
  const { items, createdAt, totalPrice, _id } = order;
  return (
    <div className='padding-container'>
      <div>
        {formatDate(createdAt)} ({items.length} items) ${totalPrice}
      </div>
      <div>
        {items.map((product) => (
          <CartItem p={product} disableOptions={true} key={product._id} />
        ))}
      </div>
      <div>
        <Link to={`/orders/${_id}`} className='link'>
          {' '}
          See more details
        </Link>
      </div>
    </div>
  );
};

OrderHistoryItem.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderHistoryItem;
