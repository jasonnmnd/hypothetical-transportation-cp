import axios from "axios";
import { GET_SCHOOLS } from "./types"; 

//GET SCHOOLS
export const getSchools = () => {

    axios
    .get('/api/school/', tokenConfig(getState))
    .then((res) => {
        dispatch({
            type: GET_SCHOOLS,
            payload: res.data,
          });
      dispatch({
        type: POPULATE_TABLE,
        payload: res.data,
      });
    })
    .catch((err) => dispatch(returnErrors(err.response.data, err.response.status)));

}

export const searchSchools = (i1, i2) => (dispatch, getState) => {

    axios.get(`/api/school/?search=${i2}&search_fields=${i1}`, tokenConfig(getState))
        .then(res => {
          dispatch({
            type: GET_SCHOOLS,
            payload: res.data,
          });
          dispatch({
            type: POPULATE_TABLE,
            payload: res.data
          })
        }).catch(err => dispatch(returnErrors(err.response.data, err.response.status)));
};
  