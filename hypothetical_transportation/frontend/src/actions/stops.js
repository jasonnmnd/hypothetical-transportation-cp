import axios from "axios";
import { GET_STOPS, GET_STOP, DELETE_STOP, POPULATE_TABLE } from "./types"; 
import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';
import { getParameters, getQueryStringsFormatted, pageSize } from "./utils";

export const getStopByRoute = (parameters) => (dispatch, getState) => {
    let config = tokenConfig(getState);
    if(parameters){
      config.params = getParameters(parameters);
    }
      axios
      .get('/api/stop/', config)
      .then((res) => {
          dispatch({
              type: GET_STOPS,
              payload: res.data,
            });
        dispatch({
          type: POPULATE_TABLE,
          payload: res.data,
        });
      })
      .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
  
  }
  

export const getStopInfo = (stopID) => (dispatch, getState) => {
      axios
      .get(`/api/stop/${stopID}`, tokenConfig(getState))
      .then((res) => {
          dispatch({
              type: GET_STOP,
              payload: res.data,
            });
      })
      .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));
  }
  

export const deleteStop = (stopID) => (dispatch, getState) => {
axios
    .delete(`/api/stop/${stopID}/`, tokenConfig(getState))
    .then(res => {
        dispatch(createMessage({ stop: 'Stop Deleted' }));
        dispatch({
            type: DELETE_STOP,
            payload: parseInt(id)
        });
    })
    .catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
}
