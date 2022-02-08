import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import { connect } from "react-redux";
import Router from "./components/routing/Router";
import { failLogin, tokenLogin } from "./actions/auth";
import { useEffect } from "react";


function App( props ) {
  //Handle main login accross the whole app

  
  useEffect(() => {
    // Get the jwt token is stored in cookie
    const authToken = localStorage.getItem('token')
    if (!authToken) {
        props.failLogin();
        return
    }
    
    props.tokenLogin(authToken);

  }, [])
  // Update auth state when user logs in
  // useEffect(() => {
  //     if(!signInState.loading && signInState.data?.token) {
  //         updateAuthState(true)
  //     }
  // }, [signInState.data])




  if(props.isLoading) {
    return <p>Loading....</p>
  }
  return (
    <div className="App">
      <Router/>
    </div>
  );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading
});

export default connect(mapStateToProps, {failLogin, tokenLogin})(App);