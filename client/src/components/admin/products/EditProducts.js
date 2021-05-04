import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../layout/Spinner';
import LoadingForm from '../../layout/LoadingForm';
import { detailsProduct, editProduct } from '../../../actions/product';
import { clearAlert, setError } from '../../../actions/alert';
import MessageBox from '../../layout/MessageBox';
const EditProducts = ({
  detailsProduct,
  product: { product, loading, loadingEdit },
  editProduct,
  alert: { isError, msg, isSuccess },
  clearAlert,
  setError,
}) => {
  const { id } = useParams();
  const [productEdited, setProductEdited] = useState({});
  useEffect(() => {
    detailsProduct(id);
    clearAlert();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (!loading && Object.keys(product).length > 0) {
      setProductEdited({
        name: product.name,
        brand: product.brand,
        price: product.price,
        category: product.category,
        stockNumber: 0,
        description: product.description,
        gender: product.gender,
        images:
          product.images !== undefined && product.images.length > 0
            ? product.images
            : [],
      });
    }
    // eslint-disable-next-line
  }, [product]);
  const onChange = (e) => {
    setProductEdited({
      ...productEdited,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const {
      name,
      brand,
      price,
      category,
      stockNumber,
      description,
      gender,
    } = productEdited;
    // if any of the input fields is empty, set the error alert.

    name === '' ||
    brand === '' ||
    price === '' ||
    category === '' ||
    stockNumber === '' ||
    description === '' ||
    gender === ''
      ? setError('Please fill out all the fields.')
      : editProduct(id, productEdited);
  };
  return (
    <div>
      <div className='form-container'>
        <h1 className='center'>Edit Product</h1>
        {!loading ? (
          Object.keys(product).length !== 0 ? (
            <form onSubmit={onSubmit}>
              <div className='form-container__element'>
                <label htmlFor='name' className='font-form'>
                  Product Name
                </label>
                <input
                  type='text'
                  name='name'
                  value={productEdited.name || ''}
                  onChange={onChange}
                  required
                />
              </div>
              <div className='form-container__element'>
                <label htmlFor='brand' className='font-form'>
                  Brand
                </label>
                <input
                  type='text'
                  name='brand'
                  value={productEdited.brand || ''}
                  onChange={onChange}
                  required
                />
              </div>
              <div className='form-container__element'>
                <label htmlFor='price' className='font-form'>
                  Price
                </label>
                <input
                  type='text'
                  name='price'
                  value={productEdited.price || ''}
                  onChange={onChange}
                  required
                />
              </div>
              <div className='form-container__two-elements'>
                <div>
                  <select
                    name='category'
                    onChange={onChange}
                    value={productEdited.category || ''}
                    className='font-form'
                  >
                    <option value='Clothing'>Clothing</option>
                    <option value='Shoes'>Shoes</option>
                    <option value='Accessories'>Accessories</option>
                  </select>
                </div>
                <div className='form-container__two-elements'>
                  <label htmlFor='gender' className='font-form'>
                    Gender:
                  </label>
                  <input
                    type='radio'
                    name='gender'
                    value='Male'
                    onChange={onChange}
                    checked={productEdited.gender === 'Male'}
                  />
                  <label htmlFor='gender' className='font-form'>
                    Male
                  </label>
                  <input
                    type='radio'
                    name='gender'
                    value='Female'
                    onChange={onChange}
                    checked={productEdited.gender === 'Female'}
                  />
                  <label htmlFor='gender' className='font-form'>
                    Female
                  </label>
                </div>
              </div>

              <div className='form-container__element'>
                <label htmlFor='stockNumber' className='font-form'>
                  Additional stock to the current inventory
                </label>
                <input
                  type='text'
                  name='stockNumber'
                  value={productEdited.stockNumber || ''}
                  onChange={onChange}
                  required
                />
              </div>
              <div className='form-container__element'>
                <label htmlFor='description' className='font-form'>
                  Description
                </label>
                <textarea
                  cols='40'
                  rows='5'
                  name='description'
                  onChange={onChange}
                  value={productEdited.description || ''}
                ></textarea>
              </div>
              {isError && !loadingEdit && (
                <MessageBox msg={msg} type={'danger'} />
              )}
              {isSuccess && !loadingEdit && (
                <MessageBox msg={msg} type={'success'} />
              )}
              {loadingEdit && <LoadingForm />}
              <div className='form-container__element'>
                <input
                  type='submit'
                  value='Update Product'
                  className='btn btn-dark light'
                />
              </div>
            </form>
          ) : (
            isError && <MessageBox msg={msg} type={'danger'} />
          )
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

EditProducts.propTypes = {
  detailsProduct: PropTypes.func.isRequired,
  editProduct: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  product: state.productDetailsReducer,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  detailsProduct,
  editProduct,
  clearAlert,
  setError,
})(EditProducts);
