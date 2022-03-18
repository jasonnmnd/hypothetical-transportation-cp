import axios from "axios";
import { VALIDATE_BULK_IMPORT } from "./types"; 
import { tokenConfig } from './auth';
import { getParameters } from "./utils";

import { createMessage, returnErrors } from './messages';



export const validate = (data, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);
    axios
    .post('/api/loaded-data/validate/', data, config)
    .then((res) => {
        dispatch({
            type: VALIDATE_BULK_IMPORT,
            payload: res.data,
          });
          onSuccess();
    })
    .catch((err) => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});

}

