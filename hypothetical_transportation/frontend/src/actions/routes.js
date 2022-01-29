import axios from "axios";
import { GET_ROUTES, POPULATE_TABLE } from "./types"; 
import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';

export const getRoutes = () => (dispatch, getState) => {

    axios
    .get('/api/route/', tokenConfig(getState))
    .then((res) => {
        dispatch({
            type: GET_ROUTES,
            payload: res.data,
          });
      dispatch({
        type: POPULATE_TABLE,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));

}

export const searchRoutes = (i1, i2) => (dispatch, getState) => {

    axios.get(`/api/route/?search=${i2}&search_fields=${i1}`, tokenConfig(getState))
        .then(res => {
          dispatch({
            type: GET_ROUTES,
            payload: res.data,
          });
          dispatch({
            type: POPULATE_TABLE,
            payload: res.data
          })
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
  