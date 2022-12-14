import axios from 'axios';
import { returnErrors, createMessage } from './messages';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    ADD_USER,
    ADD_STUDENT
} from './types';

//CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    //User Loading
    dispatch({type: USER_LOADING});

    axios.get('/api/auth/user', tokenConfig(getState))
    .then(res => {
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    }).catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        
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
    
       axios.post('/api/auth/login', body, config)
       .then(res => {
           dispatch({
               type: LOGIN_SUCCESS,
               payload: res.data
           });
       }).catch(err => {
           dispatch(returnErrors(err.response.data, err.response.status));
           dispatch({
               type: LOGIN_FAIL
           })
       })
}

// REGISTER USER
export const register = (user, students) => (dispatch, getState) => {
    axios
      .post('/api/auth/invite', user, tokenConfig(getState))
      .then((res) => {
        dispatch(createMessage({ user: 'User Created' }));
        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data,
        });
        // dispatch({
        //   type: ADD_USER,
        //   payload: res.data,
        // });
        if(students.length>0){
          students.map((stu)=>{
            var toSend = {...stu, ["guardian"]:res.data.id};
            console.log(toSend)
            axios
            .post('/api/student/', toSend, tokenConfig(getState))
            .then((res) => {
              dispatch(createMessage({ student: 'Student Created' }));
              dispatch({
                type: ADD_STUDENT,
                payload: res.data,
              });
            })
          })
        }
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        // dispatch({
        //   type: REGISTER_FAIL,
        // });
      });
  };

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  console.log("LOGGING OUT")
    axios
      .post('/api/auth/logout/', null, tokenConfig(getState))
      .then((res) => {
        dispatch({
          type: LOGOUT_SUCCESS,
        });
      })
      .catch((err) => {
        //console.log(err)
        dispatch(returnErrors(err.response.data, err.response.status));
      });
  };

// RESET USER PASSWORD
export const resetPassword = (old_password, new_password) => (dispatch, getState) => {

    //Request body
    const body = JSON.stringify({old_password, new_password});

    axios.put(`/api/auth/change-password`, body, tokenConfig(getState))
            .then((res) => {
              dispatch({
                type: RESET_PASSWORD_SUCCESS,

              });
            })
            .catch((err) => {
              dispatch(alert("Old password entered was incorrect. Try again."));
              dispatch(returnErrors(err.response.data, err.response.status));
              dispatch({
                type: RESET_PASSWORD_FAIL,
              });
            });
}

export const resetResetPassword = () => (dispatch) => {
  dispatch({
    type: RESET_PASSWORD_FAIL
  })
}

export const failLogin = () => (dispatch) => {
  dispatch({
    type: LOGIN_FAIL
  })
}

export const tokenLogin = (token) => (dispatch) => {
  //check if token is valid and return user
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
  };
  
  return axios
      .get('/api/auth/user', config)
      .then((res) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            user: res.data,
            token: token
          }
        });
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
        // dispatch({
        //   type: REGISTER_FAIL,
        // });
      });
}
  
// Setup config with token - helper function
export const tokenConfig = (getState) => {
  // Get token from state
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers['Authorization'] = `Token ${token}`;
  }

  return config;
};

export const tokenConfigDrive = (getState) => {
  // Get token from state
  //const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      // 'Content-Type': 'application/json',
      //'Access-Control-Allow-Origin': '*',
    },
  };


  return config;
};
