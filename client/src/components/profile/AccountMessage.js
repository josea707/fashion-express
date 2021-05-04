import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
const AccountMessage = ({ user: { firstName, lastName } }) => {
  return (
    <div className='padding-container'>
      <h2>
        {' '}
        Welcome, {firstName} {lastName}
      </h2>
      <p>
        {' '}
        Here you can edit your personal information, change your password, and
        delete your account.
      </p>
    </div>
  );
};

AccountMessage.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(AccountMessage);
