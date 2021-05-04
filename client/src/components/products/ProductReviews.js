import React from 'react';
import PropTypes from 'prop-types';
import Rating from '../layout/Rating';
import AddReview from './AddReview';
import { formatDate } from '../../utils/formatDate';
const ProductReviews = ({ reviews, user }) => {
  return (
    <div className='padding-container'>
      {user.isAuthenticated && <AddReview user={user} />}
      <h2 className='center'>Reviews ({reviews.length})</h2>

      {reviews.map((review) => (
        <div className='container-reviews' key={review.date}>
          <h3>
            {' '}
            {review.title} <Rating rating={review.rating} isNumReviews={true} />{' '}
          </h3>

          <p>
            <span>
              {' '}
              Reviewed by {review.name} - {formatDate(review.date)}
            </span>
          </p>
          <p> {review.comment}</p>
        </div>
      ))}
    </div>
  );
};

ProductReviews.propTypes = {
  reviews: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
};

export default ProductReviews;
