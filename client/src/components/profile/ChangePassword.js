import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { changePassword } from '../../actions/user';
import { setError } from '../../actions/alert';
import MessageBox from '../layout/MessageBox';
import LoadingForm from '../layout/LoadingForm';
const ChangePassword = ({
  user: { user, loading },
  changePassword,
  setError,
  alert: { isError, isSuccess, msg },
}) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword1: '',
    newPassword2: '',
  });
  const { currentPassword, newPassword1, newPassword2 } = passwords;
  const { _id } = user;
  const onChange = (e) =>
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    currentPassword === '' || newPassword1 === '' || newPassword2 === ''
      ? setError('Please fill out all the fields')
      : newPassword1 !== newPassword2
      ? setError('Passwords do not match')
      : changePassword(passwords, _id);
  };
  return (
    <div className='form-container profile-info'>
      <h1 className='center font-medium'>Change Password</h1>
      <form onSubmit={onSubmit}>
        <div className='form-container__element'>
          <label htmlFor='currentPassword' className='font-form'>
            Current Password
          </label>
          <input
            type='password'
            name='currentPassword'
            value={currentPassword}
            onChange={onChange}
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='newPassword1' className='font-form'>
            New Password
          </label>
          <input
            type='password'
            name='newPassword1'
            value={newPassword1}
            onChange={onChange}
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='newPassword2' className='font-form'>
            Confirm new password
          </label>
          <input
            type='password'
            name='newPassword2'
            value={newPassword2}
            onChange={onChange}
          />
        </div>
        <div>
          {isSuccess && !loading && <MessageBox type={'success'} msg={msg} />}

          {isError && !loading && <MessageBox type={'danger'} msg={msg} />}
          {loading && <LoadingForm />}
        </div>
        <div>
          <input
            type='submit'
            value='Update password'
            className='btn btn-yellow'
          />
        </div>
      </form>
    </div>
  );
};

ChangePassword.propTypes = {
  user: PropTypes.object.isRequired,
  changePassword: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  changePassword,
  setError,
})(ChangePassword);
