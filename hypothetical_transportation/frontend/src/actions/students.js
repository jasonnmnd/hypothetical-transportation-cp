import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

import { ADD_STUDENT, GET_ERRORS, CREATE_MESSAGE, GET_STUDENTS, DELETE_STUDENT, POPULATE_TABLE } from './types';


// GET STUDENTS
export const getStudents = () => (dispatch, getState) => {
  axios
    .get('/api/student/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_STUDENTS,
        payload: res.data,
      });
      dispatch({
        type: POPULATE_TABLE,
        payload: res.data
      })
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// DELETE STUDENTS
export const deleteStudents = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/Students/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_STUDENT,
        payload: id
      });
    })
    .catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
}

// ADD STUDENT
export const addStudent = (student) => (dispatch, getState) => {
  axios
    .post('/api/Students/', student, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_STUDENT,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

export const searchStudents = (i1, i2) => (dispatch, getState) => {
  axios.get(`/api/student/?search=${i2}&search_fields=${i1}`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: GET_STUDENTS,
          payload: res.data,
        });
        dispatch({
          type: POPULATE_TABLE,
          payload: res.data
        })
      }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};


export const getStudentsByGuardian = (guardianID) => (dispatch, getState) => {
  axios.get(`/api/student/?guardian=${guardianID}`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: POPULATE_TABLE,
          payload: res.data,
        });
      }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};

