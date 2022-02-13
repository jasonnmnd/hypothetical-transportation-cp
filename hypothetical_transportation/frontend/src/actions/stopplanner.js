import axios from "axios";
import { tokenConfig } from "./auth";
import { returnErrors, createMessage } from "./messages";
import { ADD_STOP, DELETE_STOP } from './types';


  export const updateStop = (stop, id) => (dispatch, getState) => {
    axios
      .put(`/api/stop/${id}/`,stop, tokenConfig(getState))
      .then(res =>{
        dispatch(createMessage({ stop: 'Stop Updated' }));
        dispatch({
          type: DELETE_STOP,
          payload: parseInt(id)
        })
        //console.log(res.data);
        dispatch({
          type: ADD_STOP,
          payload: res.data
        })
          
      }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
  }
  
