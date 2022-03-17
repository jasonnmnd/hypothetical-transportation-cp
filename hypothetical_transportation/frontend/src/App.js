import React from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import { connect } from "react-redux";
import Router from "./components/routing/Router";
import { failLogin, tokenLogin } from "./actions/auth";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import { LOGIN_SUCCESS } from "./actions/types";

function App( props ) {
  //Whole app from here

  const [authStateChecking, setAuthStateChecking] = useState(true);
  const dispatch = useDispatch()
  const [isAuthenticated, updateAuthState] = useState(false)
  
  useEffect(() => {
    // Get the jwt token is stored in cookie
    const authToken = localStorage.getItem('token')
    if (!authToken) {
        // props.failLogin();
        // return
        updateAuthState(false)
        setAuthStateChecking(false)
        return
    }
    
    // props.tokenLogin(authToken).then(setAuthStateChecking(false));

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${authToken}`
      },
    };
    
    axios
        .get('/api/auth/user', config)
        .then((res) => {
          updateAuthState(true)
          dispatch({
            type: LOGIN_SUCCESS,
            payload: {
              user: res.data,
              token: authToken
            }
          });
        })
        .catch((err) => {
          console.log(err)
          updateAuthState(false)
          //dispatch(returnErrors(err.response.data, err.response.status));
          // dispatch({
          //   type: REGISTER_FAIL,
          // });
        })
        .finally(() => {
          setAuthStateChecking(false)
        })

  }, [])

//   useEffect(() => {
//     if(!props.auth.isLoading && props.auth.token) {
//         updateAuthState(true)
//     }
// }, [props.auth.user])

  // useEffect(() => {
  //   // Get the jwt token is stored in cookie
  //   setAuthStateChecking(props.isLoading)
    
  // }, [props.isLoading])
  // Update auth state when user logs in
  // useEffect(() => {
  //     if(!signInState.loading && signInState.data?.token) {
  //         updateAuthState(true)
  //     }
  // }, [signInState.data])




  if(authStateChecking) {
    return <p>Loading....</p>
  }
  return (
    <div className="App">
      <Router/>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {failLogin, tokenLogin})(App);