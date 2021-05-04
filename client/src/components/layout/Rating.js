import React, { Fragment } from 'react';

export default function Rating({ rating, numReviews, isNumReviews }) {
  return (
    <Fragment>
      <div className='rating'>
        <span>
          <i
            className={
              rating >= 1
                ? 'fa fa-star'
                : rating >= 0.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              rating >= 2
                ? 'fa fa-star'
                : rating >= 1.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              rating >= 3
                ? 'fa fa-star'
                : rating >= 2.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              rating >= 4
                ? 'fa fa-star'
                : rating >= 3.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        <span>
          <i
            className={
              rating >= 5
                ? 'fa fa-star'
                : rating >= 4.5
                ? 'fa fa-star-half-o'
                : 'fa fa-star-o'
            }
          ></i>
        </span>
        {!isNumReviews && (
          <span className='dark'>
            {' '}
            ({numReviews} {numReviews === 1 ? ' review' : 'reviews'}){' '}
          </span>
        )}
      </div>
    </Fragment>
  );
}
