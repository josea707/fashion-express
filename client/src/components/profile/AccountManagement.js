import React, { useState, useEffect } from 'react';
import AccountMessage from './AccountMessage';
import { connect } from 'react-redux';
import Profile from './Profile';
import ChangePassword from './ChangePassword';
import Delete from './Delete';
import PropTypes from 'prop-types';
import { clearAlert } from '../../actions/alert';
const AccountManagement = ({ clearAlert }) => {
  const [linkAccount, setLinkAccount] = useState('initialMessage');
  useEffect(() => {
    clearAlert();
    // eslint-disable-next-line
  }, [linkAccount]);
  const handleLinks = (e) => {
    setLinkAccount(e.target.value);
  };
  return (
    <div className='row top start no-wrap'>
      <div className='account-wrapper account-management'>
        <button
          to={'/accounts/editor'}
          className={
            linkAccount === 'edit'
              ? 'btn btn-light-silver account-management__link'
              : 'btn account-management__link '
          }
          value='edit'
          onClick={handleLinks}
        >
          {' '}
          Edit Information
        </button>
        <button
          to={'/accounts/passwords'}
          className={
            linkAccount === 'password'
              ? 'btn btn-light-silver account-management__link'
              : 'btn account-management__link '
          }
          value='password'
          onClick={handleLinks}
        >
          {' '}
          Change Password
        </button>
        <button
          to={'/accounts/deletion'}
          className={
            linkAccount === 'delete'
              ? 'btn btn-light-silver account-management__link'
              : 'btn account-management__link '
          }
          value='delete'
          onClick={handleLinks}
        >
          {' '}
          Delete Account
        </button>
      </div>
      {linkAccount === 'initialMessage' && <AccountMessage />}
      {linkAccount === 'edit' && <Profile />}
      {linkAccount === 'password' && <ChangePassword />}
      {linkAccount === 'delete' && <Delete setLinkAccount={setLinkAccount} />}
    </div>
  );
};
AccountManagement.propTypes = {
  clearAlert: PropTypes.func.isRequired,
};

export default connect(undefined, { clearAlert })(AccountManagement);
//export default AccountManagement;
