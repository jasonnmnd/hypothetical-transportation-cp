import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

import { ADD_STUDENT, GET_STUDENT, CREATE_MESSAGE, GET_STUDENTS, DELETE_STUDENT, POPULATE_TABLE, DELETE_ITEM, UPDATE_STUDENT } from './types';
import { getOffsetString, getQueryStringsFormatted } from './utils';


// GET STUDENTS
export const getStudents = (pageNum = -1) => (dispatch, getState) => {
  axios
  .get(`/api/student/?${getOffsetString(pageNum)}`, tokenConfig(getState))
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


export const searchStudents = (i1, i2, i3) => (dispatch, getState) => {
  let url=`/api/student/`
    if(i1==="" || i2==="" || i1===undefined || i2===undefined){
      if(i3!==""&& i3!==undefined){
        url=`/api/student/?ordering=${i3}`
      }
    }
    else{
      if(i3!=="" && i3!==undefined){
        url=`/api/student/?search=${i2}&search_fields=${i1}&ordering=${i3}`
      }
      else{
        url=`/api/student/?search=${i2}&search_fields=${i1}`
      }
    }
  
  
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