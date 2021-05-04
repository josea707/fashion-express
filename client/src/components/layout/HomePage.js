import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImageSlider from '../layout/ImageSlider';
import { loadProducts } from '../../actions/product';
import ProductCard from '../products/ProductCard';
import homePageImages from '../../utils/homePageImages';
import Spinner from './Spinner';
const HomePage = ({
  loadProducts,
  productsListReducer: { products, loading },
}) => {
  // only show the latest 10 products
  const limit = 8;
  const categorize = {
    category: '',
    gender: '',
    sortOrder: '',
    searchValue: '',
    page: 1,
  };
  useEffect(() => {
    loadProducts(categorize, limit);
    // eslint-disable-next-line
  }, []);
  return (
    <div className='homepage-container'>
      <div className='homepage-container__images'>
        <ImageSlider images={homePageImages()} />
      </div>
      <h3 className='center homepage-container__title'> New Arrivals</h3>
      <div className='homepage-container__products'>
        <div className='product-container__layout--products'>
          {loading ? (
            <Spinner />
          ) : (
            products.length > 0 &&
            products.map((product) => (
              <Fragment key={product._id}>
                <ProductCard product={product} />
              </Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  loadProducts: PropTypes.func.isRequired,
  productsListReducer: PropTypes.object,
};

const mapStateToProps = (state) => ({
  productsListReducer: state.productsListReducer,
});

export default connect(mapStateToProps, { loadProducts })(HomePage);
