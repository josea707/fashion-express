import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { detailsProduct } from '../../actions/product';
import { addToCart } from '../../actions/cart';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import ImageSlider from '../layout/ImageSlider';
import Rating from '../layout/Rating';
import ProductReviews from './ProductReviews';
import { clearAlert } from '../../actions/alert';
import MessageBox from '../layout/MessageBox';
const ProductDetails = ({
  detailsProduct,
  productDetailsReducer: { product, loading },
  user,
  addToCart,
  clearAlert,
  alert: { isError, msg },
}) => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    clearAlert();
    detailsProduct(id);
    // eslint-disable-next-line
  }, []);

  const addToCartHandler = () => {
    addToCart(
      product._id,
      product.name,
      quantity,
      product.images,
      product.price,
      product.stockNumber
    );
  };
  return (
    <div>
      <div className='margin-container'>
        <Link to='/products'>
          {' '}
          <i className='fas fa-arrow-circle-left'></i>{' '}
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : Object.keys(product).length > 0 && id === product._id ? (
        <div>
          <div className='product-details'>
            <div className='product-details__image product-details__margin'>
              <ImageSlider images={product.images} />
            </div>
            <div className='product-details__info product-details__margin'>
              <ul>
                <li>
                  <h1>{product.name}</h1>
                </li>
                <li>Price: ${product.price}</li>
                <li>
                  Description:
                  <p>{product.description}</p>
                </li>
                <li>
                  <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  />
                </li>
              </ul>
            </div>

            <div className='product-details__cart product-details__margin'>
              <ul>
                <li>
                  <div>Price: ${product.price}</div>
                </li>
                <li>
                  <div>
                    Status:
                    {product.stockNumber > 0 ? (
                      <span className='success'> In Stock</span>
                    ) : (
                      <span className='danger'> Unavailable</span>
                    )}
                  </div>
                </li>
                {product.stockNumber > 0 && (
                  <>
                    <li>
                      <div>
                        Quantity:{' '}
                        <select
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className='select-options'
                        >
                          {[...Array(product.stockNumber).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </li>
                    <li>
                      <button
                        onClick={addToCartHandler}
                        className='btn btn-yellow'
                      >
                        Add to Cart
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <ProductReviews reviews={product.reviews} user={user} />
        </div>
      ) : (
        isError && (
          <div className='padding-container'>
            <MessageBox type={'danger'} msg={msg} />
          </div>
        )
      )}
    </div>
  );
};

ProductDetails.propTypes = {
  detailsProduct: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  productDetailsReducer: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  cart: PropTypes.array.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  productDetailsReducer: state.productDetailsReducer,
  user: state.user,
  cart: state.cart.cart,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  detailsProduct,
  addToCart,
  clearAlert,
})(ProductDetails);
