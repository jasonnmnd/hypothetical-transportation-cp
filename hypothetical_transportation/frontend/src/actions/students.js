import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

import { GET_STUDENTS, DELETE_STUDENT, ADD_STUDENT, GET_ERRORS, CREATE_MESSAGE } from './types';


// GET STUDENTS
export const getStudents = () => (dispatch, getState) => {
  axios
    //.get('/api/student/', tokenConfig(getState))
    .get('/api/student/')
    .then((res) => {
      dispatch({
        type: GET_STUDENTS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// DELETE STUDENTS
export const deleteStudents = (id) => (dispatch) => {
  axios
    .delete(`/api/Students/${id}`)
    .then(res => {
      dispatch({
        type: DELETE_STUDENT,
        payload: id
      });
    })
    .catch(err => console.log(err));
}

// ADD STUDENT
export const addStudent = (student) => (dispatch) => {
  axios
    .post('/api/Students/', student)
    .then((res) => {
      dispatch({
        type: ADD_STUDENT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
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

