import axios from 'axios';

import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

import { ADD_STUDENT, GET_STUDENT, CREATE_MESSAGE, GET_STUDENTS, DELETE_STUDENT, POPULATE_TABLE } from './types';


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
export const deleteStudent = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/student/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_STUDENT,
        payload: id
      });
      dispatch({
        type: DELETE_ITEM,
        payload: id
      });
    })
    .catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
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
      }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
};

export const getStudentInfo = (studentID) => (dispatch, getState) => {
  axios.get(`/api/student/${studentID}/`, tokenConfig(getState))
    .then(res => {
      let thisStudent = res.data;
      console.log(thisStudent);

      axios.get(`/api/user/${thisStudent.guardian}/`, tokenConfig(getState))
        .then(res => {
          thisStudent.guardianName = res.data.full_name;
          
          axios.get(`/api/school/${thisStudent.school}/`, tokenConfig(getState))
            .then(res => {
              thisStudent.schoolName = res.data.name;

              if (thisStudent.routes!==undefined && thisStudent.routes!==null){
                axios.get(`/api/route/${thisStudent.routes}/`, tokenConfig(getState))
                  .then(res => {
                    thisStudent.routeName = res.data.name;
                    dispatch({
                      type: GET_STUDENT,
                      payload: thisStudent,
                    });
                }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
              }
              else{
                thisStudent.routeName = "NONE";
                dispatch({
                  type: GET_STUDENT,
                  payload: thisStudent,
                });
              }


          }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
      
      
      
      
        }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
      
      

      
  }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
}

