import axios from "axios";
import { tokenConfig } from "./auth";
import { returnErrors } from "./messages";
import { GET_STUDENTS_IN_ROUTE, GET_STUDENTS_WITHOUT_ROUTE, ADD_ROUTE, DELETE_ROUTE } from './types';

//GET STUDENTS CURRENTLY IN THE ROUTE
export const getStudentsInRoute = (routeID) => (dispatch, getState) => {
    axios
      .get(`/api/student/?routes=${routeID}`, tokenConfig(getState))
      .then((res) => {
        dispatch({
          type: GET_STUDENTS_IN_ROUTE,
          payload: res.data,
        });
        dispatch({
          type: POPULATE_TABLE,
          payload: res.data
        })
      })
      .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
  };

//GET STUDENTS CURRENT NOT IN THE ROUTE (BUT GO TO THE SCHOOL)
export const getStudentsWithoutRoute = (schoolID) => (dispatch, getState) => {
    axios
      .get(`/api/student/?school=${schoolID}&routes__isnull=true`, tokenConfig(getState))
      .then((res) => {
        dispatch({
          type: GET_STUDENTS_WITHOUT_ROUTE,
          payload: res.data,
        });
        dispatch({
          type: POPULATE_TABLE,
          payload: res.data
        })
      })
      .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
  };


  export const addRoute = (route, students) => (dispatch, getState) => {
    axios
      .post('/api/route/', route, tokenConfig(getState))
      .then((res) => {
        console.log(students)
        if(students.length>0){
          students.map((student)=>{
            const stu = {...student,["routes"]:res.data.id,["school"]:student.school.id,["guardian"]:student.guardian.id};
            axios
            .put(`/api/student/${student.id}/`,stu, tokenConfig(getState))
            .then(res =>{
              dispatch({
                type: DELETE_STUDENT,
                payload: parseInt(student.id)
              })
              console.log(res.data);
              dispatch({
                type: ADD_STUDENT,
                payload: res.data
              })
            }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});        
          })
        }
        dispatch({
          type: ADD_ROUTE,
          payload: res.data,
        });
      })
      .catch((err) => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  };


  export const updateRoute = (route, id) => (dispatch, getState) => {
    axios
      .put(`/api/route/${id}/`,route, tokenConfig(getState))
      .then(res =>{
        dispatch({
          type: DELETE_ROUTE,
          payload: parseInt(id)
        })
        console.log(res.data);
        dispatch({
          type: ADD_ROUTE,
          payload: res.data
        })
          
      }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  }
  
  export const removeStudentFromRoute = (student) => (dispatch,getState)=>{
    const stu = {...student,["routes"]:null,["school"]:student.school.id,["guardian"]:student.guardian.id};
    axios
    .put(`/api/student/${student.id}/`,stu, tokenConfig(getState))
    .then(res =>{
      dispatch({
        type: DELETE_STUDENT,
        payload: parseInt(student.id)
      })
      console.log(res.data);
      dispatch({
        type: ADD_STUDENT,
        payload: res.data
      })
    }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  }

  export const addStudentToRoute = (student, id) => (dispatch,getState)=>{
    const stu = {...student,["routes"]:id,["school"]:student.school.id,["guardian"]:student.guardian.id};
    axios
    .put(`/api/student/${student.id}/`,stu, tokenConfig(getState))
    .then(res =>{
      dispatch({
        type: DELETE_STUDENT,
        payload: parseInt(student.id)
      })
      console.log(res.data);
      dispatch({
        type: ADD_STUDENT,
        payload: res.data
      })
    }).catch(err => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  }