import axios from 'axios';
import config from '../utils/config';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

import {GET_IN_RANGE_STOP, ADD_STUDENT, GET_STUDENT, CREATE_MESSAGE, GET_STUDENTS, DELETE_STUDENT, POPULATE_TABLE, DELETE_ITEM, UPDATE_STUDENT, RESET_EXPOSED_USER } from './types';
import { getOffsetString, getQueryStringsFormatted, getParameters } from './utils';


// GET STUDENTS
export const getStudents = (parameters) => (dispatch, getState) => {
  let config = tokenConfig(getState);
  if(parameters){
    config.params = getParameters(parameters);
  }
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
      dispatch(createMessage({ student: 'Student Deleted' }));
      dispatch({
        type: DELETE_STUDENT,
        payload: parseInt(id)
      });
    })
    .catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
}

// ADD STUDENT
export const addStudent = (student) => (dispatch, getState) => {
  axios
    .post('/api/student/', student, tokenConfig(getState))
    .then((res) => {
      dispatch(createMessage({ student: 'Student Created' }));
      console.log("?")
      dispatch({
        type: RESET_EXPOSED_USER,
      });
      console.log("xxxxxxxx")

      dispatch({
        type: ADD_STUDENT,
        payload: res.data,
      });
    })
    .catch((err) => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
};

//addStudentWithParent, updateStudentWithParent

export const addStudentWithParent = (parent, student) => (dispatch, getState) => {

  axios
      .post('/api/auth/invite', parent, tokenConfig(getState))
      .then((res) => {
        const stu = ({ ...student, ["guardian"]: res.data.id})
        axios
        .post('/api/student/', stu, tokenConfig(getState))
        .then((res) => {
          dispatch(createMessage({ student: 'Student Created' }));
          dispatch({
            type: RESET_EXPOSED_USER,
          });
          dispatch({
            type: ADD_STUDENT,
            payload: res.data,
          });
        })
        .catch((err) => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});    
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
};

export const updateStudentWithParent = (parent, student) => (dispatch, getState) => {
  axios
      .post('/api/auth/invite', parent, tokenConfig(getState))
      .then((res) => {
        const stu = ({ ...student, ["guardian"]: res.data.id})
        console.log(res)
        console.log(stu)
        axios
        .put(`/api/student/${stu.id}/`,stu, tokenConfig(getState))
        .then((res) => {
          dispatch(createMessage({ student: 'Student Updated' }));
          dispatch({
            type: DELETE_STUDENT,
            payload: parseInt(stu.id)
          })
          dispatch({
            type: ADD_STUDENT,
            payload: res.data
          })
        })
        .catch((err) => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});    
      })
      .catch((err) => {
        dispatch(returnErrors(err.response.data, err.response.status));
      });
};

export const resetExposedUser = ()=>(dispatch, getState) =>{
  dispatch({
    type: RESET_EXPOSED_USER
  })
}

export const updateStudent = (student, id) => (dispatch, getState) => {
  axios
          .put(`/api/student/${id}/`,student, tokenConfig(getState))
          .then(res =>{
            dispatch(createMessage({ student: 'Student Updated' }));
            dispatch({
              type: DELETE_STUDENT,
              payload: parseInt(id)
            })
            //console.log(res.data);
            dispatch({
              type: ADD_STUDENT,
              payload: res.data
            })
              
          }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
}

export const patchStudent = (student, id) => (dispatch, getState) => {
  
  
  axios
          .patch(`/api/student/${id}/`,student, tokenConfig(getState))
          .then(res =>{
            // dispatch(createMessage({ student: 'Student Updated' }));
            dispatch({
              type: DELETE_STUDENT,
              payload: parseInt(id)
            })
            //console.log(res.data);
            dispatch({
              type: ADD_STUDENT,
              payload: res.data
            })
              
          }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
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
      }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
};

export const getStudentInfo = (studentID) => (dispatch, getState) => {
  axios.get(`/api/student/${studentID}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_STUDENT,
        payload: res.data,
      });     
  }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
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

export const getInRangeStop = (studentID, parameters) =>(dispatch, getState) => {
  // axios.get(`/api/student/${studentID}/inrange_stops/`, tokenConfig(getState))
  //       .then(res => {
  //         dispatch({
  //           type: GET_IN_RANGE_STOP,
  //           payload: res.data,
  //         });
  //       }).catch(err => console.log(err));



        let config = tokenConfig(getState);
        if(parameters){
          config.params = getParameters(parameters);
        }
        axios
        .get(`/api/student/${studentID}/inrange_stops/`, config)
          .then((res) => {
          dispatch({
            type: GET_IN_RANGE_STOP,
            payload: res.data,
          });
})
          .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
}