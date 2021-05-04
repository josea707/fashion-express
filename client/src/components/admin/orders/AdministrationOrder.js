import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllOrders } from '../../../actions/order';
import PropTypes from 'prop-types';
import Spinner from '../../layout/Spinner';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
const AdministrationOrder = ({
  getAllOrders,
  ordersListState: { orders, loading, numOrders },
}) => {
  const [email, setEmail] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  useEffect(() => {
    getAllOrders(page, limit, email);
    // eslint-disable-next-line
  }, [page]);
  const handleSearch = (e) => {
    e.preventDefault();
    page === 1 ? getAllOrders(page, limit, email) : setPage(1);
  };
  const increasePages = () => {
    setPage(page + 1);
  };
  const decreasePages = () => {
    setPage(page - 1);
  };
  return (
    <div className='margin-container'>
      <div>
        <form onSubmit={handleSearch} className='search-container center'>
          <input
            type='email'
            className='search-bar'
            onChange={(e) => setEmail(e.target.value)}
            name='search'
            placeholder=' Search for an order by email...'
            value={email}
          />
        </form>
        {!loading ? (
          orders.length > 0 ? (
            <div className='padding-top overflow-table'>
              <table className='styled-table padding-top'>
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Order date</th>
                    <th>Total price</th>
                    <th>Delivered status</th>
                    <th> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td> {order.userEmail} </td>
                      <td>
                        {order.shippingAddress.firstName +
                          ' ' +
                          order.shippingAddress.lastName}
                      </td>
                      <td> {formatDate(order.createdAt)} </td>
                      <td> ${order.totalPrice} </td>
                      {order.isDelivered ? (
                        <td className='success'>Order Delivered </td>
                      ) : (
                        <td className='danger'>Order Not delivered yet</td>
                      )}
                      <td>
                        <Link to={`/admins/orders/${order._id}`}>
                          Order Details and actions
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='center margin-container'>
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
          ) : (
            <p className='center'>No orders found or made..</p>
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};
AdministrationOrder.propTypes = {
  getAllOrders: PropTypes.func.isRequired,
  ordersListState: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ordersListState: state.ordersListState,
});

export default connect(mapStateToProps, { getAllOrders })(AdministrationOrder);
