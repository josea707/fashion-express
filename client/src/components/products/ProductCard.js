import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Rating from '../layout/Rating';
const ProductCard = ({ product }) => {
  const { _id, images, name, price } = product;
  return (
    <div className='product-card'>
      <div className='product-card__image'>
        <Link to={'/products/details/' + _id}>
          <img className='product' src={images[0]} alt={name}></img>
        </Link>
      </div>
      <div className='product-card__info'>
        <h4>{name}</h4>
        <p> ${price}</p>
        <Rating rating={product.rating} numReviews={product.numReviews} />
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
export default ProductCard;
