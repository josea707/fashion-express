import React, { useState, useEffect } from 'react';
import LoadingForm from '../../layout/LoadingForm';
import axios from 'axios';
import ImageUploader from 'react-images-upload';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MessageBox from '../../layout/MessageBox';
import { clearAlert, setError, setSuccess } from '../../../actions/alert';
const CreateProduct = ({
  clearAlert,
  setError,
  setSuccess,
  alert: { isSuccess, msg, isError },
  history,
}) => {
  const [id, setId] = useState('');
  useEffect(() => {
    clearAlert();
    // eslint-disable-next-line
  }, []);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    brand: '',
    price: 0,
    category: 'Clothing',
    stockNumber: 0,
    description: '',
    gender: '',
  });
  const {
    name,
    brand,
    price,
    category,
    stockNumber,
    description,
    gender,
  } = product;
  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      name === '' ||
      brand === '' ||
      price === '' ||
      category === '' ||
      stockNumber === '' ||
      description === '' ||
      gender === ''
    )
      setError('Please fill out all the fields.');
    else {
      setLoading(true);
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const body = JSON.stringify({
          name,
          brand,
          price,
          category,
          stockNumber,
          description,
          gender,
        });
        const res = await axios.post('/api/products', body, config);
        if (res) setId(res.data.id);
        // remove any error alerts triggered before uploading images.
        clearAlert();
      } catch (error) {
        setError(error.response.data.msg);
      }
      setLoading(false);
    }
  };
  const redirectProductList = () => {
    setTimeout(function () {
      history.push('/admins/products');
    }, 3000);
  };
  const onChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };
  const onDrop = (picture) => {
    setImages([...images, picture]);
  };

  const uploadImages = () => {
    if (images.length === 0)
      setError('Please add images before uploading to the server');
    else {
      clearAlert();
      setLoading(true);
      let i = 0;
      let imageUploads = images.map((image) => {
        let data = new FormData();
        data.append('image', image[i]);
        ++i;
        return axios.post(`/api/uploads/${id}`, data);
      });
      axios
        .all(imageUploads)
        .then((results) => {
          setSuccess(results[0].data.msg);
          redirectProductList();
        })
        .catch((error) => setError(error.response.data.msg));
    }
  };
  return (
    <div>
      <div className='form-container'>
        <h1 className='center'>Create Product</h1>
        {id === '' ? (
          <form onSubmit={onSubmit}>
            <div className='form-container__element'>
              <label htmlFor='name' className='font-form'>
                Product Name
              </label>
              <input
                type='text'
                name='name'
                value={name}
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
                value={brand}
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
                value={price}
                onChange={onChange}
                required
              />
            </div>
            <div className='form-container__two-elements'>
              <div>
                <select
                  name='category'
                  onChange={onChange}
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
                  onClick={onChange}
                />
                <label htmlFor='gender' className='font-form'>
                  Male
                </label>
                <input
                  type='radio'
                  name='gender'
                  value='Female'
                  onClick={onChange}
                />
                <label htmlFor='gender' className='font-form'>
                  Female
                </label>
              </div>
            </div>

            <div className='form-container__element'>
              <label htmlFor='stockNumber' className='font-form'>
                Stock Number
              </label>
              <input
                type='text'
                name='stockNumber'
                placeholder='Number in stock'
                value={stockNumber}
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
                value={description}
              ></textarea>
            </div>
            {isError && !loading && <MessageBox msg={msg} type={'danger'} />}
            {loading && <LoadingForm />}
            <div className='form-container__element'>
              <input
                type='submit'
                value='Create Product'
                className='btn btn-dark light'
              />
            </div>
          </form>
        ) : (
          <div className='image-uploader'>
            <ImageUploader
              withIcon={true}
              buttonText='Choose images'
              withPreview={true}
              onChange={onDrop}
              imgExtension={['.jpg', '.png']}
              maxFileSize={5242880}
              buttonStyles={{ margin: '0 auto' }}
            />
            {loading && !isError && !isSuccess && (
              <div className='margin-container'>
                <LoadingForm />{' '}
              </div>
            )}
            {isError && (
              <div className='center margin-container'>
                <MessageBox msg={msg} type={'danger'} />
              </div>
            )}
            {isSuccess && (
              <div className='center margin-container'>
                <MessageBox msg={msg} type={'success'} />
                <p> Redirecting you back to the Product Listing Page..</p>
              </div>
            )}
            {!isSuccess && (
              <button
                onClick={uploadImages}
                className='btn btn-dark center light'
              >
                {' '}
                Upload Images
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

CreateProduct.propTypes = {
  clearAlert: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setSuccess: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  alert: state.alert,
});

export default connect(mapStateToProps, { clearAlert, setError, setSuccess })(
  CreateProduct
);
