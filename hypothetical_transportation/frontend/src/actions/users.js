import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';
import { getStudents } from './students';
import { getParameters } from './utils';
import { GET_USERS, EXPOSED_RESULT,ADD_USER, DELETE_USER, POPULATE_TABLE, GET_USER, DELETE_ITEM,RESET_POSTED_USER } from './types';


export const getUsers = (parameters) => (dispatch, getState) => {
  let config = tokenConfig(getState);
  if(parameters){
    config.params = getParameters(parameters);
  }

  return axios
    .get('/api/user/', config)
    .then((res) => {
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};


export const emailExpose = (email) => (dispatch, getState) => {
  return axios.delete(`/api/user/expose/${email}/`, tokenConfig(getState))
  .then(res => {
      dispatch({
          type: EXPOSED_RESULT,
          payload: res
        });
  }).catch(err => {
    // console.log(err);/*console.log(err);*/
    alert(`Error: ${err.response.data}`);
    dispatch(returnErrors(err.response.data, err.response.status))});
}


export const deleteUser = (id) => (dispatch, getState) => {
    return axios.delete(`/api/user/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ user: 'User Deleted' }));
        dispatch({
            type: DELETE_USER,
            payload: parseInt(id)
          });
    }).catch(err => {
      // console.log(err);/*console.log(err);*/
      alert(`Error: ${err.response.data}`);
      dispatch(returnErrors(err.response.data, err.response.status))});
}

export const addUser = (user) => (dispatch, getState) => {
    return axios
    .post(`/api/auth/invite`, user, tokenConfig(getState))
    .then(res =>{
      dispatch(createMessage({ user: 'User Created' }));
        dispatch({
            type: ADD_USER,
            payload: res.data,
          });

    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};


export const resetPostedUser = ()=>(dispatch)=>{
  dispatch({
    type: RESET_POSTED_USER,
  });
}


export const getUser = (id) => (dispatch, getState) => {
  return axios.get(`/api/user/${id}/`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: GET_USER,
          payload: res.data
        })
        //res.data.groups.includes(1)?setColumn("admin_user"):setColumn("parent_user")
      }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
  }

  export const updateUser = (user, id) => (dispatch, getState) => {
    return axios
            .put(`/api/user/${id}/`,user, tokenConfig(getState))
            .then(res =>{
              dispatch(createMessage({ user: 'User Updated' }));
              dispatch({
                type: DELETE_USER,
                payload: parseInt(id)
              })
              //console.log(res.data);
              dispatch({
                type: ADD_USER,
                payload: res.data
              })
                
            }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
  }
  

