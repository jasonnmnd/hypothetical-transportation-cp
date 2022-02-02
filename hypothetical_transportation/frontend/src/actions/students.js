import axios from 'axios';
import config from '../utils/config';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

import { ADD_STUDENT, GET_STUDENT, CREATE_MESSAGE, GET_STUDENTS, DELETE_STUDENT, POPULATE_TABLE, DELETE_ITEM, UPDATE_STUDENT } from './types';
import { getOffsetString, getQueryStringsFormatted, pageSize } from './utils';


// GET STUDENTS
export const getStudents = (parameters) => (dispatch, getState) => {
  //const url = `/api/student/?ordering=${sort}&search=${value}&search_fields=${filter}&${getOffsetString(pageNum)}`;
  let config = tokenConfig(getState);
  if(parameters){
    //config.params = {}
    if(parameters.pageNum != null && parameters.pageNum !== undefined){
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
  

  console.log(config);

  
  axios
  .get("/api/student/", config)
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

// export const getStudentsPaged = (pageNum) => (dispatch, getState) => {
//   axios
//     .get(`/api/student/?${getOffsetString(pageNum)}`, tokenConfig(getState))
//     .then((res) => {
//       dispatch({
//         type: GET_STUDENTS,
//         payload: res.data,
//       });
//       dispatch({
//         type: POPULATE_TABLE,
//         payload: res.data
//       })
//     })
//     .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
// };

// GET STUDENTS BY USER ID
export const getStudentsByUserID = (parentID) => (dispatch, getState) => {
  axios
    .get(`/api/student/?guardian=${parentID}`, tokenConfig(getState))
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
export const deleteStudent = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/student/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_STUDENT,
        payload: parseInt(id)
      });
      dispatch({
        type: DELETE_ITEM,
        payload: parseInt(id)
      });
    })
    .catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
}

// ADD STUDENT
export const addStudent = (student) => (dispatch, getState) => {
  axios
    .post('/api/student/', student, tokenConfig(getState))
    .then((res) => {
      dispatch({
        type: ADD_STUDENT,
        payload: res.data,
      });
    })
    .catch((err) => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
};

export const updateStudent = (student, id) => (dispatch, getState) => {
  axios
          .put(`/api/student/${id}/`,student, tokenConfig(getState))
          .then(res =>{
            dispatch({
              type: DELETE_STUDENT,
              payload: parseInt(id)
            })
            console.log(res.data);
            dispatch({
              type: ADD_STUDENT,
              payload: res.data
            })
              
          }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
}


export const searchStudents = (filter, value, sort, pageNum = -1) => (dispatch, getState) => {
  const url = `/api/student/?ordering=${sort}&search=${value}&search_fields=${filter}&${getOffsetString(pageNum)}`

  axios.get(url, tokenConfig(getState))
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


export const getStudentsByID = (idObj) => (dispatch, getState) => {
  
  const queryString = getQueryStringsFormatted(idObj);

  axios.get(`/api/student/${queryString}`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: POPULATE_TABLE,
          payload: res.data,
        });
        dispatch({
          type: GET_STUDENTS,
          payload: res.data,
        });
      }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
};

export const getStudentInfo = (studentID) => (dispatch, getState) => {
  axios.get(`/api/student/${studentID}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_STUDENT,
        payload: res.data,
      });     
  }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
}

export const getStudent = (studentID) => (dispatch, getState) => {
  axios.get(`/api/student/${studentID}/`, tokenConfig(getState))
        .then(res => {
          dispatch({
            type: GET_STUDENT,
            payload: res.data,
          });
        }).catch(err => console.log(err));
}