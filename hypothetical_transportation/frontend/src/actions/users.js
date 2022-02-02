import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';
import { getStudents } from './students';
import { pageSize } from './utils';
import { GET_USERS, ADD_USER, DELETE_USER, POPULATE_TABLE, GET_USER, DELETE_ITEM } from './types';


export const getUsers = (parameters) => (dispatch, getState) => {
  let config = tokenConfig(getState);
  if(parameters){
    if(parameters.pageNum != null && parameters.pageNum !== undefined  && parameters.pageNum != -1){
      const {pageNum, ...preParams} = parameters
      config.params = {
        limit: pageSize,
        offset: pageSize * (pageNum-1),
        ...preParams
      }
    }
    else{
      config.params = parameters
    }
  }

  axios
    .get('/api/user/', config)
    .then((res) => {
      dispatch({
        type: GET_USERS,
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
            payload: parseInt(id)
          });
          dispatch({
            type: DELETE_ITEM,
            payload: parseInt(id)
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

export const searchUsers = (i1, i2, i3) => (dispatch, getState) => {
  let url=`/api/user/`
  if(i1==="" || i2==="" || i1===undefined || i2===undefined){
    if(i3!==""&& i3!==undefined){
      url=`/api/user/?ordering=${i3}`
    }
  }
  else{
    if(i3!=="" && i3!==undefined){
      url=`/api/user/?search=${i2}&search_fields=${i1}&ordering=${i3}`
    }
    else{
      url=`/api/user/?search=${i2}&search_fields=${i1}`
    }
  }
  
  axios.get(url, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_USERS,
                payload: res.data,
              });
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};




export const getUser = (id) => (dispatch, getState) => {
  axios.get(`/api/user/${id}/`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: GET_USER,
          payload: res.data
        })
        //res.data.groups.includes(1)?setColumn("admin_user"):setColumn("parent_user")
      }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  }

  export const updateUser = (user, id) => (dispatch, getState) => {
    axios
            .put(`/api/user/${id}/`,user, tokenConfig(getState))
            .then(res =>{
              dispatch({
                type: DELETE_USER,
                payload: parseInt(id)
              })
              console.log(res.data);
              dispatch({
                type: ADD_USER,
                payload: res.data
              })
                
            }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  }
  

