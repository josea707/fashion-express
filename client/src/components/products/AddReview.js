import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { submitReview } from '../../actions/product';
import { connect } from 'react-redux';
import { setError } from '../../actions/alert';
import MessageBox from '../layout/MessageBox';
import LoadingForm from '../layout/LoadingForm';
const AddReview = ({
  user,
  submitReview,
  product: { _id },
  loadingReview,
  alert: { isError, msg, isSuccess },
  setError,
}) => {
  const [review, setReview] = useState({
    rating: '',
    title: '',
    comment: '',
  });
  const { rating, title, comment } = review;
  const onChange = (e) => {
    setReview({
      ...review,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    rating === '' || title === '' || comment === ''
      ? setError('Please fill out all the fields')
      : submitReview(user.email, rating, title, user.firstName, comment, _id);
  };

  return (
    <div>
      <div className='form-container'>
        <form onSubmit={onSubmit}>
          <div className='form-container__element'>
            <label htmlFor='title' className='font-form'>
              Review title
            </label>
            <input type='text' name='title' value={title} onChange={onChange} />
          </div>
          <div className='form-container__element'>
            <select name='rating' onChange={onChange} className='font-form'>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
          </div>
          <div className='form-container__element'>
            <label htmlFor='comment' className='font-form'>
              Comment
            </label>
            <textarea
              cols='40'
              rows='5'
              name='comment'
              onChange={onChange}
              value={comment}
            ></textarea>
          </div>
          {loadingReview && <LoadingForm />}
          {isError && !loadingReview && (
            <MessageBox type={'danger'} msg={msg} />
          )}
          {isSuccess && !loadingReview && (
            <MessageBox type={'success'} msg={msg} />
          )}
          <div>
            <input
              type='submit'
              value='Submit Review'
              className='btn btn-dark light'
            />
          </div>
        </form>
      </div>
    </div>
  );
};

AddReview.propTypes = {
  submitReview: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
  loadingReview: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
  product: state.productDetailsReducer.product,
  alert: state.alert,
  loadingReview: state.productDetailsReducer.loadingReview,
});

export default connect(mapStateToProps, { submitReview, setError })(AddReview);
