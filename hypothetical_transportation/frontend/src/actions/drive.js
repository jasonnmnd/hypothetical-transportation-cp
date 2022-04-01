import axios from "axios";
import { ONE_RUN_SET, DRIVE_ERROR, MANY_RUN_SET, GET_LOG } from "./types"; 
import { tokenConfig } from './auth';
import { getParameters } from "./utils";

import { createMessage, returnErrors } from './messages';
import { EXAMPLE_ACTIVE_RUN_1 } from "../utils/drive";

export const startRun = (data, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);


    axios
    .post('/api/run/', data, config)
    .then((res) => {
        dispatch({
            type: ONE_RUN_SET,
            payload: {},
        });
        onSuccess();
    })
    .catch((err) => {/*console.log(err);*/
        dispatch({
            type: DRIVE_ERROR,
            payload: err,
        });
    });

}

export const endRun = (routeId, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);
    

    axios
    .post('/api/bus/finished_run', {route: routeId}, config)
    .then((res) => {
        dispatch({
            type: ONE_RUN_SET,
            payload: {},
        });
        onSuccess();
    })
    .catch((err) => {/*console.log(err);*/
        dispatch({
            type: DRIVE_ERROR,
            payload: err,
        });
    });

    
}

export const reachStop = (routeId, stop, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);

    axios
    .put(`/api/bus/${routeId}/`, {previous_stop: stop}, config)
    .then((res) => {
        dispatch({
            type: ONE_RUN_SET,
            payload: {},
        });
        onSuccess();
    })
    .catch((err) => {/*console.log(err);*/
        dispatch({
            type: DRIVE_ERROR,
            payload: err,
        });
    });

}

export const getRunByRoute = (routeId, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);

    axios
    .get(`/api/bus/route/${routeId}`, config)
    .then((res) => {
        dispatch({
            type: ONE_RUN_SET,
            payload: res.data,
          });
          onSuccess();
    })
    .catch((err) => {/*console.log(err);*/
        dispatch({
            type: DRIVE_ERROR,
            payload: err,
        });
    });

}

export const getRunByBus = (busNum, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);

    axios
    .get(`/api/bus/bus/${busNum}`, config)
    .then((res) => {
        dispatch({
            type: ONE_RUN_SET,
            payload: res.data,
          });
          onSuccess();
    })
    .catch((err) => {/*console.log(err);*/
        dispatch({
            type: DRIVE_ERROR,
            payload: err,
        });
    });

}

export const getRunByDriver = (driverId, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);
    console.log(driverId)
    dispatch({
        type: ONE_RUN_SET,
        payload: EXAMPLE_ACTIVE_RUN_1,
      });

    // axios
    // .get(`/api/bus/driver/${driverId}`, config)
    // .then((res) => {
    //     dispatch({
    //         type: ONE_RUN_SET,
    //         payload: res.data,
    //       });
    //       onSuccess();
    // })
    // .catch((err) => {/*console.log(err);*/
    //     dispatch({
    //         type: DRIVE_ERROR,
    //         payload: err,
    //     });
    // });

}

export const getRunsBySchool = (schools, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);

    axios
    .get(`/api/bus/school/?school=${schools}`, config)
    .then((res) => {
        dispatch({
            type: MANY_RUN_SET,
            payload: res.data,
          });
          onSuccess();
    })
    .catch((err) => {/*console.log(err);*/
        dispatch({
            type: DRIVE_ERROR,
            payload: err,
        });
    });

}

// export const getLogBySchool = (schools, onSuccess = () => {}) => (dispatch, getState) => {
//     let config = tokenConfig(getState);

//     axios
//     .get(`/api/transit_log/?school=${schools}`, config)
//     .then((res) => {
//         dispatch({
//             type: GET_LOG,
//             payload: res.data,
//           });
//           onSuccess();
//     })
    // .catch((err) => {/*console.log(err);*/
    //     dispatch({
    //         type: DRIVE_ERROR,
    //         payload: err,
    //     });
    // });
// }

export const getLog = (parameters) => (dispatch, getState) => {
    let config = tokenConfig(getState);
    if(parameters){
      config.params = getParameters(parameters);
    }
    axios
      .get('/api/transit_log/', config)
      .then((res) => {
        dispatch({
            type: GET_LOG,
            payload: res.data,
        });
      })
      .catch((err) => {/*console.log(err);*/
        dispatch({
            type: DRIVE_ERROR,
            payload: err,
        });
    });
  
  }

