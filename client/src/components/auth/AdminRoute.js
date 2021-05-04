import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ component: Component, user:{isAdmin}, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin ? (
          <Component {...props}></Component>
        ) : (
          <Redirect to="/login" />
        )
      }
    ></Route>
  );
}

const mapStateToProps = state => ({
    user: state.user.isAdmin
});
export default connect(mapStateToProps)(PrivateRoute);