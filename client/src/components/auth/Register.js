import React, { useState, useEffect } from 'react';
import { register } from '../../actions/user';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearAlert, setError } from '../../actions/alert';
import MessageBox from '../layout/MessageBox';
import LoadingForm from '../layout/LoadingForm';
const Register = ({
  register,
  user: { isAuthenticated, loading },
  clearAlert,
  setError,
  alert: { isError, msg },
}) => {
  useEffect(() => {
    clearAlert();
    // eslint-disable-next-line
  }, []);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
  });

  const { firstName, lastName, email, password, password2 } = user;

  const onChange = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      email === '' ||
      firstName === '' ||
      lastName === '' ||
      password === '' ||
      password2 === ''
    )
      setError('Please fill out all the fields');
    else if (password !== password2) {
      setError("Passwords don't match");
    } else {
      register({ firstName, lastName, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }
  return (
    <div className='form-container' onSubmit={onSubmit}>
      <h1 className='center'>Register</h1>
      <form>
        <div className='form-container__element'>
          <label htmlFor='firstName' className='font-form'>
            First Name
          </label>
          <input
            type='text'
            name='firstName'
            value={firstName}
            onChange={onChange}
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
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='email' className='font-form'>
            Email Address
          </label>
          <input type='email' name='email' value={email} onChange={onChange} />
        </div>
        <div className='form-container__element'>
          <label htmlFor='password' className='font-form'>
            Password
          </label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='password2' className='font-form'>
            Confirm Password
          </label>
          <input
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
          />
        </div>
        {loading && <LoadingForm />}
        {isError && !loading && <MessageBox type={'danger'} msg={msg} />}
        <div>
          <input
            type='submit'
            value='Register'
            className='btn btn-dark light'
          />
        </div>
      </form>
    </div>
  );
};
Register.propTypes = {
  register: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
});

export default connect(mapStateToProps, {
  register,
  clearAlert,
  setError,
})(Register);
