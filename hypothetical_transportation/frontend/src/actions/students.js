import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

import { GET_USERS, GET_ERRORS, CREATE_MESSAGE } from './types';


// GET STUDENTS
export const getStudents = () => (dispatch, getState) => {
  axios
    .get('/api/student/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
};

// DELETE STUDENTS
export const deleteStudents = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/Students/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_USER,
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

// export const testingError = () => (dispatch) => {
//   const fakeError = {
//     msg: {
//       name: "Fake name not valid",
//     },
//     status: "Fake Error Status"
//   };
//   const fakeMessage = {
//     passwordNotMatch: "This is a fake message!"
//   }
//   //dispatch(createMessage(fakeMessage))
//   dispatch({
//     type: CREATE_MESSAGE,
//     payload: fakeMessage,
//   })
// }

