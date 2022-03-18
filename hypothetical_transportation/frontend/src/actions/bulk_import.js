import axios from "axios";
import { } from "./types"; 
import { tokenConfig } from './auth';
import { getParameters } from "./utils";

import { createMessage, returnErrors } from './messages';



export const validate = (data) => (dispatch, getState) => {
    let config = tokenConfig(getState);
    axios
    .post('/api/loaded-data/validate/', data, config)
    .then((res) => {
        console.log(res)
    //     dispatch({
    //         type: GET_SCHOOLS,
    //         payload: res.data,
    //       });
    //   dispatch({
    //     type: POPULATE_TABLE,
    //     payload: res.data,
    //   });
    })
    .catch((err) => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});

}

