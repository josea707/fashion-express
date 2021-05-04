import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
const Admin = ({ user: { firstName, lastName } }) => {
  return (
    <div className='padding-container'>
      <h2>
        {' '}
        Welcome, {firstName} {lastName}
      </h2>
      <p> Here you can manage all products and orders in our system.</p>
    </div>
  );
};

Admin.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.user,
});

export default connect(mapStateToProps)(Admin);
