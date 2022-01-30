import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';
import { getStudents } from './students';

import { GET_USERS, ADD_USER, DELETE_USER, POPULATE_TABLE, GET_USER, DELETE_ITEM } from './types';


export const getUsers = () => (dispatch, getState) => {
  axios
    .get('/api/user/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
      dispatch({
        type: POPULATE_TABLE,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const deleteUser = (id) => (dispatch, getState) => {
    axios.delete(`/api/user/${id}/`, tokenConfig(getState))
    .then(res => {
      console.log("SUCCESS")
        dispatch({
            type: DELETE_USER,
            payload: id
          });
          dispatch({
            type: DELETE_ITEM,
            payload: id
          })
    }).catch(err => {console.log("FAIL");console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
}

export const addUser = (user) => (dispatch, getState) => {
    axios
    .post(`/api/auth/register`, user, tokenConfig(getState))
    .then(res =>{
        dispatch({
            type: ADD_USER,
            payload: res.data,
          });

    }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const searchUsers = (i1, i2) => (dispatch, getState) => {
    axios.get(`/api/user/?search=${i2}&search_fields=${i1}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: POPULATE_TABLE,
                payload: res.data,
              });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};


export const getUser = (id) => (dispatch, getState) => {
  console.log("HELLO")
  axios.get(`/api/user/${id}/`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: GET_USER,
          payload: res.data
        })
        //res.data.groups.includes(1)?setColumn("admin_user"):setColumn("parent_user")
      }).catch(err => console.log(err));
  }

