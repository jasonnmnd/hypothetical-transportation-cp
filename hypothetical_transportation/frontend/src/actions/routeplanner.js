import axios from "axios";
import { tokenConfig } from "./auth";
import { returnErrors } from "./messages";
import { GET_STUDENTS_IN_ROUTE, GET_STUDENTS_WITHOUT_ROUTE } from './types';

//GET STUDENTS CURRENTLY IN THE ROUTE
export const getStudentsInRoute = (routeID) => (dispatch, getState) => {
    axios
      .get(`/api/?routes=${routeID}`, tokenConfig(getState))
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
export const getStudentsWithoutRoute = () => (dispatch, getState) => {
    axios
      .get('', tokenConfig(getState))
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