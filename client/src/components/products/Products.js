import React, { Fragment, useEffect, useState } from 'react';
import ProductFilter from './ProductFilter';
import ProductCard from './ProductCard';
import { connect } from 'react-redux';
import { loadProducts } from '../../actions/product';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
const Products = ({
  loadProducts,
  productsListReducer: { products, loading, numProducts },
}) => {
  const { searchValue } = useParams();
  const [categorize, setCategorize] = useState({
    category: '',
    gender: '',
    sortOrder: '',
    searchValue: searchValue ? searchValue : '',
    page: 1,
  });
  const { page } = categorize;
  const [limit, setLimit] = useState(8);
  useEffect(() => {
    loadProducts(categorize, limit);
    // eslint-disable-next-line
  }, [categorize, page]);
  const submitCategory = (e) => {
    e.preventDefault();
    categorize[e.target.name] === e.target.value
      ? setCategorize({ ...categorize, [e.target.name]: '', page: 1 })
      : setCategorize({
          ...categorize,
          [e.target.name]: e.target.value,
          page: 1,
        });
  };
  const clearAll = (e) => {
    e.preventDefault();
    setCategorize({
      category: '',
      gender: '',
      sortOrder: '',
      searchValue: '',
      page: 1,
    });
  };
  const increasePages = () => {
    setCategorize({ ...categorize, page: page + 1 });
  };
  const decreasePages = () => {
    setCategorize({ ...categorize, page: page - 1 });
  };
  return (
    <div>
      {categorize.searchValue !== '' && (
        <h2 className='search-title'> Results for: {searchValue} </h2>
      )}
      <div className='product-container'>
        <ProductFilter
          submitCategory={submitCategory}
          clearAll={clearAll}
          categorize={categorize}
        />
        <div className='product-container__layout'>
          <div className='product-container__layout--products'>
            {!loading ? (
              <Fragment>
                {products.map((product) => (
                  <Fragment key={product._id}>
                    <ProductCard product={product} />
                  </Fragment>
                ))}
                {products.length === 0 && (
                  <p className='margin-container'> No products found.. </p>
                )}
              </Fragment>
            ) : (
              <Spinner />
            )}
          </div>
          <div className='product-container__layout--buttons center padding-container'>
            <button
              onClick={decreasePages}
              className='btn btn-dark'
              disabled={page - 1 === 0}
            >
              {' '}
              <p className='light'>&lt;</p>{' '}
            </button>

            <button
              onClick={increasePages}
              className='btn btn-dark'
              disabled={numProducts - page * limit <= 0}
            >
              {' '}
              <p className='light'> &gt;</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Products.propTypes = {
  loadProducts: PropTypes.func.isRequired,
  productsListReducer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  productsListReducer: state.productsListReducer,
});

export default connect(mapStateToProps, { loadProducts })(Products);
