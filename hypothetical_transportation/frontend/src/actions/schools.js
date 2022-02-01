import axios from "axios";
import { GET_SCHOOLS, POPULATE_TABLE, GET_SCHOOL, DELETE_SCHOOL, DELETE_ITEM, ADD_SCHOOL } from "./types"; 
import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';
//GET SCHOOLS
export const getSchools = () => (dispatch, getState) => {

    axios
    .get('/api/school/', tokenConfig(getState))
    .then((res) => {
        dispatch({
            type: GET_SCHOOLS,
            payload: res.data,
          });
      dispatch({
        type: POPULATE_TABLE,
        payload: res.data,
      });
    })
    .catch((err) => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});

}

export const addSchool = (school) => (dispatch, getState) => {
  axios
    .post('/api/school/', school, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_SCHOOL,
        payload: res.data,
      });
    })
    .catch((err) => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
};

export const deleteSchool = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/school/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_SCHOOL,
        payload: parseInt(id)
      });
      dispatch({
        type: DELETE_ITEM,
        payload: parseInt(id)
      });
    })
    .catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
}

export const searchSchools = (i1, i2, i3) => (dispatch, getState) => {
  let url=`/api/school/`
    if(i1==="" || i2==="" || i1===undefined || i2===undefined){
      if(i3!==""&& i3!==undefined){
        url=`/api/school/?ordering=${i3}`
      }
    }
    else{
      if(i3!=="" && i3!==undefined){
        url=`/api/school/?search=${i2}&search_fields=${i1}&ordering=${i3}`
      }
      else{
        url=`/api/school/?search=${i2}&search_fields=${i1}`
      }
    }

    axios.get(url, tokenConfig(getState))
        .then(res => {
          dispatch({
            type: GET_SCHOOLS,
            payload: res.data,
          });
          dispatch({
            type: POPULATE_TABLE,
            payload: res.data
          })
        }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
};

export const getSchool = (id) => (dispatch, getState) => {
  axios.get(`/api/school/${id}/`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: GET_SCHOOL,
          payload: res.data
        })
      }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  }

  export const updateSchool = (school, id) => (dispatch, getState) => {
    axios
            .put(`/api/school/${id}/`,school, tokenConfig(getState))
            .then(res =>{
              dispatch({
                type: DELETE_SCHOOL,
                payload: parseInt(id)
              })
              dispatch({
                type: ADD_SCHOOL,
                payload: res.data
              })
                
            }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  }