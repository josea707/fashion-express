import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import OrderHistoryItem from './OrderHistoryItem';
import { connect } from 'react-redux';
import { getOrders } from '../../actions/order';
import Spinner from '../layout/Spinner';
const OrderHistory = ({
  ordersListState: { orders, loading, numOrders },
  getOrders,
}) => {
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  useEffect(() => {
    getOrders(page, limit);
    // eslint-disable-next-line
  }, [page]);
  const increasePages = () => {
    setPage(page + 1);
  };
  const decreasePages = () => {
    setPage(page - 1);
  };
  return (
    <div className='padding-container'>
      <h2> Order History</h2>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div>{numOrders} Results </div>
          <div>
            {orders.map((order) => (
              <OrderHistoryItem order={order} key={order._id} />
            ))}
          </div>
          <div className='center'>
            <button
              onClick={decreasePages}
              className='btn btn-dark light'
              disabled={page - 1 === 0}
            >
              {' '}
              &lt;{' '}
            </button>
            <button
              onClick={increasePages}
              className='btn btn-dark light'
              disabled={numOrders - page * limit <= 0}
            >
              {' '}
              &gt;{' '}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

OrderHistory.propTypes = {
  getOrders: PropTypes.func.isRequired,
  ordersListState: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ordersListState: state.ordersListState,
});

export default connect(mapStateToProps, { getOrders })(OrderHistory);
