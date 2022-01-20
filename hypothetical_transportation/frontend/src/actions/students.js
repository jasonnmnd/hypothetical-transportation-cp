import axios from 'axios';
import { createMessage, returnErrors } from './messages';
import { tokenConfig } from './auth';

import { GET_STUDENTS, DELETE_STUDENT, ADD_STUDENT } from './types';

// GET STUDENTS
export const getStudents = () => (dispatch, getState) => {
  axios
    .get('/api/Students/', tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: GET_STUDENTS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

