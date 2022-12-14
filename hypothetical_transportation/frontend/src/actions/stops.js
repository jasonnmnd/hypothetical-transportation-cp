import axios from "axios";
import { GET_STOPS, GET_STOP, DELETE_STOP, POPULATE_TABLE, ADD_STOP } from "./types"; 
import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';
import { getParameters, getQueryStringsFormatted, pageSize } from "./utils";

export const getStopByRoute = (route_id) => (dispatch, getState) => {
    let config = tokenConfig(getState);
      axios
      .get(`/api/stop/?route=${route_id}`, config)
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
      .get(`/api/stop/${stopID}/`, tokenConfig(getState))
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
            payload: parseInt(stopID)
        });
    })
    .catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
}

  
  export const createStop = (stop) => (dispatch, getState) => {
    axios
      .post('/api/stop/', stop, tokenConfig(getState))
      .then((res) => {
        // dispatch(createMessage({ student: 'Stop Created' }));
        dispatch({
          type: ADD_STOP,
          payload: res.data
      });
      })
      .catch((err) => {console.log(err);dispatch(returnErrors(err.response.data, err.response.status))});
  };

  export const updateStop = (stop, id) => (dispatch, getState) => {
    axios
            .put(`/api/stop/${id}/`,stop, tokenConfig(getState))
            .then(res =>{
              // dispatch(createMessage({ student: 'Stop Updated' }));
              dispatch({
                type: DELETE_STOP,
                payload: parseInt(id)
            });
            dispatch({
              type: ADD_STOP,
              payload: res.data
          });
                
            }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
  }