import axios from "axios";
import { DELETE_ROUTE, GET_ROUTE, GET_ROUTES, POPULATE_TABLE, DELETE_ITEM, RESET_VIEWED_ROUTE } from "./types"; 
import { tokenConfig } from './auth';

import { createMessage, returnErrors } from './messages';
import { getParameters, getQueryStringsFormatted, pageSize } from "./utils";

export const getRoutes = (parameters) => (dispatch, getState) => {
  let config = tokenConfig(getState);
  if(parameters){
    config.params = getParameters(parameters);
  }
    axios
    .get('/api/route/', config)
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

export const resetViewedRoute = () => (dispatch) => {
  dispatch({
    type: RESET_VIEWED_ROUTE
  })
}

export const searchRoutes = (i1, i2, i3) => (dispatch, getState) => {
  let url=`/api/route/`
    if(i1==="" || i2==="" || i1===undefined || i2===undefined){
      if(i3!==""&& i3!==undefined){
        url=`/api/route/?ordering=${i3}`
      }
    }
    else{
      if(i3!=="" && i3!==undefined){
        url=`/api/route/?search=${i2}&search_fields=${i1}&ordering=${i3}`
      }
      else{
        url=`/api/route/?search=${i2}&search_fields=${i1}`
      }
    }
    axios.get(url, tokenConfig(getState))
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
  
export const getRoutesByID = (idObj) => (dispatch, getState) => {
  
  const queryString = getQueryStringsFormatted(idObj);

  axios.get(`/api/route/${queryString}`, tokenConfig(getState))
      .then(res => {
        dispatch({
          type: POPULATE_TABLE,
          payload: res.data,
        });
        dispatch({
          type: GET_ROUTES,
          payload: res.data,
        });
      }).catch(err => {
        /*console.log(err);*/
        //dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: GET_ROUTES,
          payload: {
            results: []
          }
        })
      });
};


export const getRouteInfo = (routeID) => (dispatch, getState) => {
  axios.get(`/api/route/${routeID}/`, tokenConfig(getState))
    .then(res => {
          dispatch({
            type: GET_ROUTE,
            payload: res.data,
          });
  }).catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
}

export const deleteRoute = (routeID) => (dispatch, getState) => {
  axios
    .delete(`/api/route/${routeID}/`, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage({ route: 'Route Deleted' }));
      dispatch({
        type: DELETE_ROUTE,
        payload: parseInt(id)
      });
    })
    .catch(err => {/*console.log(err);*/dispatch(returnErrors(err.response.data, err.response.status))});
}
