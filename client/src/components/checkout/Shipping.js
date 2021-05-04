import React, { useEffect, useState } from 'react';
import Steps from './Steps';
import { connect } from 'react-redux';
import { saveEmail, saveShippingAddress } from '../../actions/cart';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearOrder } from '../../actions/order';
import axios from 'axios';
import { setError, clearAlert } from '../../actions/alert';
import MessageBox from '../layout/MessageBox';
const Shipping = ({
  user: { isAuthenticated, user },
  saveShippingAddress,
  saveEmail,
  history,
  clearOrder,
  clearAlert,
  setError,
  alert: { isError, msg },
  cart: { cart },
}) => {
  const [userInformation, setUserInformation] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    province: '',
    phoneNumber: '',
  });
  const [shippingEmail, setShippingEmail] = useState('');
  const [validateEmail, setValidateEmail] = useState({
    isTaken: false,
    errorMsg: 'start',
  });
  const { isTaken, errorMsg } = validateEmail;
  useEffect(() => {
    clearOrder();
    clearAlert();
    if (isAuthenticated) {
      const { personalInformation } = user;
      setUserInformation({
        firstName: user.firstName,
        lastName: user.lastName,
        address: personalInformation.address,
        city: personalInformation.city,
        postalCode: personalInformation.postalCode,
        province: personalInformation.province,
        phoneNumber: personalInformation.phoneNumber,
      });
      setShippingEmail(user.email);
    }
    // eslint-disable-next-line
  }, []);
  // when the res is received from the server and the state is updated, check if the email is taken.
  useEffect(() => {
    // so it doesn't check if the email is taken in the first render (Prevents infinite loop)
    if (errorMsg !== 'start')
      isTaken && errorMsg !== '' ? setError(errorMsg) : nextScreen();
    // eslint-disable-next-line
  }, [isTaken, errorMsg]);

  let {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phoneNumber,
  } = userInformation;

  const onChange = (e) =>
    setUserInformation({
      ...userInformation,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    clearAlert();
    saveShippingAddress(userInformation);
    !isAuthenticated ? checkEmail() : nextScreen();
  };
  const nextScreen = () => {
    saveEmail(shippingEmail);
    history.push('/checkout/payment');
  };

  const checkEmail = async () => {
    try {
      const res = await axios.get(`/api/users/email?address=${shippingEmail}`);
      setValidateEmail({ errorMsg: res.data.msg, isTaken: res.data.isTaken });
    } catch (error) {
      setError(error.response.data.msg);
    }
  };
  // if cart is empty, go back to the cart screen
  if (Object.keys(cart).length === 0) {
    return <Redirect to='/carts' />;
  }
  return (
    <div>
      <Steps stepOne={true} />
      <div className='form-container'>
        <h1 className='center font-medium'>Customer Information</h1>
        <form onSubmit={onSubmit}>
          <div>
            <input
              type='email'
              name='email'
              value={shippingEmail}
              onChange={(e) => setShippingEmail(e.target.value)}
              disabled={isAuthenticated}
              required
            />
          </div>
          <div>
            <input
              type='text'
              name='firstName'
              placeholder='First Name'
              value={firstName}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type='text'
              name='lastName'
              placeholder='Last Name'
              value={lastName}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type='text'
              name='address'
              placeholder='Address'
              value={address}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type='text'
              name='city'
              placeholder='City'
              value={city}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <input
              type='text'
              name='postalCode'
              placeholder='Postal Code'
              value={postalCode}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <select
              name='province'
              onChange={onChange}
              className='font-form'
              value={province}
              required
            >
              <option value='AB'>Alberta</option>
              <option value='BC'>British Columbia</option>
              <option value='MB'>Manitoba</option>
              <option value='NB'>New Brunswick</option>
              <option value='NL'>Newfoundland and Labrador</option>
              <option value='NS'>Nova Scotia</option>
              <option value='ON'>Ontario</option>
              <option value='PE'>Prince Edward Island</option>
              <option value='QC'>Quebec</option>
              <option value='SK'>Saskatchewan</option>
              <option value='NT'>Northwest Territories</option>
              <option value='NU'>Nunavut</option>
              <option value='YT'>Yukon</option>
            </select>
          </div>
          <div>
            <input
              type='number'
              name='phoneNumber'
              placeholder='Phone Number'
              value={phoneNumber}
              onChange={onChange}
              required
            />
          </div>
          {isError && <MessageBox type={'danger'} msg={msg} />}
          <div>
            <input
              type='submit'
              value='Go to Payment'
              className='btn btn-dark light'
            />
          </div>
        </form>
      </div>
    </div>
  );
};
Shipping.propTypes = {
  saveShippingAddress: PropTypes.func.isRequired,
  saveEmail: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  clearOrder: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.user.isAuthenticated,
  user: state.user,
  alert: state.alert,
  cart: state.cart,
});

export default connect(mapStateToProps, {
  saveShippingAddress,
  saveEmail,
  clearOrder,
  setError,
  clearAlert,
})(Shipping);
