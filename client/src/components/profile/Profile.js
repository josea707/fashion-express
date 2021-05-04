import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { editUser } from '../../actions/user';
import { setError } from '../../actions/alert';
import MessageBox from '../layout/MessageBox';
import LoadingForm from '../layout/LoadingForm';
const Profile = ({
  user: { user, loading },
  setError,
  editUser,
  alert: { isError, msg, isSuccess },
}) => {
  const { personalInformation } = user;
  const [userInformation, setUserInformation] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    address: personalInformation.address,
    city: personalInformation.city,
    postalCode: personalInformation.postalCode,
    province: personalInformation.province,
    phoneNumber: personalInformation.phoneNumber,
  });

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

  // only the full name is mandatory
  const onSubmit = (e) => {
    e.preventDefault();
    firstName !== '' && lastName !== ''
      ? editUser(userInformation)
      : setError('Your first and last name cannot be empty');
  };

  return (
    <div className='form-container profile-info'>
      <h1 className='center font-medium'>Customer Information</h1>
      <form onSubmit={onSubmit}>
        <div className='form-container__element'>
          <label htmlFor='firstName' className='font-form'>
            First Name
          </label>
          <input
            type='text'
            name='firstName'
            value={firstName}
            onChange={onChange}
            required
          />
        </div>

        <div className='form-container__element'>
          <label htmlFor='lastName' className='font-form'>
            Last Name
          </label>
          <input
            type='text'
            name='lastName'
            value={lastName}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='address' className='font-form'>
            Address
          </label>
          <input
            type='text'
            name='address'
            value={address}
            onChange={onChange}
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='city' className='font-form'>
            City
          </label>
          <input type='text' name='city' value={city} onChange={onChange} />
        </div>
        <div className='form-container__element'>
          <label htmlFor='postalCode' className='font-form'>
            Postal Code
          </label>
          <input
            type='text'
            name='postalCode'
            value={postalCode}
            onChange={onChange}
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='province' className='font-form'>
            Province
          </label>
          <select
            name='province'
            onChange={onChange}
            className='font-form'
            value={province}
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
        <div className='form-container__element'>
          <label htmlFor='phoneNumber' className='font-form'>
            Phone Number
          </label>
          <input
            type='number'
            name='phoneNumber'
            value={phoneNumber}
            onChange={onChange}
          />
        </div>
        <div>
          {isSuccess && !loading && <MessageBox type={'success'} msg={msg} />}
          {isError && !loading && <MessageBox type={'danger'} msg={msg} />}
          {loading && <LoadingForm />}
        </div>
        <div>
          <input type='submit' value='Update' className='btn btn-yellow' />
        </div>
      </form>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  editUser: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  editUser,
  setError,
})(Profile);
