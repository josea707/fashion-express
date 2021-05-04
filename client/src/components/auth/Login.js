import React, { useState, useEffect } from 'react';
import { setError, clearAlert } from '../../actions/alert';
import { login } from '../../actions/user';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import LoadingForm from '../layout/LoadingForm';
import MessageBox from '../layout/MessageBox';
const Login = ({
  login,
  user: { isAuthenticated, loading },
  setError,
  clearAlert,
  alert: { isError, msg },
}) => {
  useEffect(() => {
    clearAlert();
    // eslint-disable-next-line
  }, []);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const { email, password } = user;

  const onChange = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const onSubmit = (e) => {
    e.preventDefault();
    email === '' || password === ''
      ? setError('Please provide an email and password')
      : login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to='/' />;
  }

  return (
    <div className='form-container'>
      <h1 className='center'>Login</h1>
      <form onSubmit={onSubmit}>
        <div className='form-container__element'>
          <label htmlFor='email' className='font-form'>
            Email Address
          </label>
          <input
            type='email'
            name='email'
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className='form-container__element'>
          <label htmlFor='email' className='font-form'>
            Password
          </label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
          />
        </div>
        {!loading ? (
          <div>
            <Link to={'/registration'}>
              {' '}
              Don't have an account? Sign up now.
            </Link>
          </div>
        ) : (
          <LoadingForm />
        )}
        {isError && !loading && <MessageBox type={'danger'} msg={msg} />}
        <div>
          <input type='submit' value='Sign in' className='btn btn-dark light' />
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  clearAlert: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  alert: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  alert: state.alert,
});
export default connect(mapStateToProps, { login, setError, clearAlert })(Login);
