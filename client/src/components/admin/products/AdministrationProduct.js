import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadProducts } from '../../../actions/product';
import PropTypes from 'prop-types';
import Spinner from '../../layout/Spinner';
import { Link } from 'react-router-dom';
const AdministrationProduct = ({
  loadProducts,
  productsListReducer: { products, loading, numProducts },
}) => {
  const [categorize, setCategorize] = useState({
    category: '',
    gender: '',
    sortOrder: '',
    searchValue: '',
    page: 1,
  });
  const [limit, setLimit] = useState(8);

  const { page } = categorize;
  const resetPages = () => {
    setCategorize({ ...categorize, page: 1 });
  };
  const increasePages = () => {
    setCategorize({ ...categorize, page: page + 1 });
  };
  const decreasePages = () => {
    setCategorize({ ...categorize, page: page - 1 });
  };
  useEffect(() => {
    loadProducts(categorize, limit);
    // eslint-disable-next-line
  }, [page]);
  /* Search by product name, brand and ID only. */
  const handleSearch = (e) => {
    e.preventDefault();
    /* we do this cause if the page is 1 when searching is executed, 
    the useEffect would not be triggered since the state won't change
    */
    page === 1 ? loadProducts(categorize, limit) : resetPages();
  };

  return (
    <div className='margin-container'>
      <div>
        <div className='table-searchbar'>
          <button className='btn btn-transparent light'>
            <Link to={'/admins/products/creation'}> + </Link>
          </button>

          <form onSubmit={handleSearch} className='search-container'>
            <input
              type='text'
              className='search-bar'
              name='searchValue'
              onChange={(e) =>
                setCategorize({
                  ...categorize,
                  [e.target.name]: e.target.value,
                })
              }
              placeholder=' Search for a product..'
              value={categorize.searchValue}
            />
          </form>
        </div>

        {!loading ? (
          products.length > 0 ? (
            <div className='padding-top overflow-table'>
              <table className='styled-table'>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Gender</th>
                    <th>Stock Number</th>
                    <th> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className='center-text'>
                      <td> {product.name} </td>
                      <td> {product.brand} </td>
                      <td> ${product.price} </td>
                      <td> {product.category} </td>
                      <td> {product.gender} </td>
                      <td> {product.stockNumber} </td>
                      <td>
                        {' '}
                        <Link to={`/admins/products/editor/${product._id}`}>
                          {' '}
                          Edit{' '}
                        </Link>
                        <Link to={`/admins/products/deletion/${product._id}`}>
                          {' '}
                          Delete{' '}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='center padding-container'>
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
                  disabled={numProducts - page * limit <= 0}
                >
                  {' '}
                  &gt;{' '}
                </button>
              </div>
            </div>
          ) : (
            <div className='add-product'>
              <p className='center'>No products found..</p>
            </div>
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};
AdministrationProduct.propTypes = {
  loadProducts: PropTypes.func.isRequired,
  productsListReducer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  productsListReducer: state.productsListReducer,
});

export default connect(mapStateToProps, { loadProducts })(
  AdministrationProduct
);
