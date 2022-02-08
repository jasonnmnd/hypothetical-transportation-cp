import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/* DOESNT WORK RIGHT NOW BECAUSE OF REACT ROUTER DOM V6*/


function PrivateRoute(props) {
  if (props.auth.isLoading) {
    return <h2>Loading...</h2>;
  } else if (!props.auth.isAuthenticated) {
    return <Navigate to="/" />;
  } else {
    return props.children;
  }
 
}


const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);