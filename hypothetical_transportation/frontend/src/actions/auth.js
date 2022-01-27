import axios from 'axios';
//import { returnErrors } from './messages';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from './types';

//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    //User Loading
    dispatch({type: USER_LOADING});

    //Get token from state
    const token = getState().auth.token;

    //Headers
    const config = {
        headers: {
            'Content-Type' : 'application/json'
        }
    }

    //If token, add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    axios.get('/api/auth/user', config)
    .then(res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch(err => {
        //dispatch(returnErrors(err.response.data));
        console.log(err.response.data);
        dispatch({
            type: AUTH_ERROR
        })
    })
}

//LOGIN USER
export const login = (email, password) => (dispatch) => {
        //Headers
       const config = {
           headers: {
               'Content-Type' : 'application/json'
           }
       }
    
       //Request body to turn into JSON
       const body = JSON.stringify({email, password})
       console.log(body);
    
       axios.post('/api/auth/login', body, config)
       .then(res => {
           console.log(res);
           dispatch({
               type: LOGIN_SUCCESS,
               payload: res.data
           });
       }).catch(err => {
           //dispatch(returnErrors(err.response.data));
           console.log(err.response.data);
           dispatch({
               type: LOGIN_FAIL
           })
       })
}
