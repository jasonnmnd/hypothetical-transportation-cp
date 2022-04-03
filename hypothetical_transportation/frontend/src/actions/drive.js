import axios from "axios";
import { ONE_RUN_SET, DRIVE_ERROR, MANY_RUN_SET, GET_LOG, ADD_BUS_LOCATION, RESET_BUS_LOCATIONS } from "./types"; 
import { tokenConfig, tokenConfigDrive } from './auth';
import { getParameters } from "./utils";

import { createMessage, returnErrors } from './messages';
import { EXAMPLE_ACTIVE_RUN_1, EXAMPLE_BUS_LOCATION_1 } from "../utils/drive";

export const startRun = (data, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);


    axios
    .post('/api/start_run/', data, config)
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

export const endRun = (routeId, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);
    

    axios
    .post(`/api/run/${routeId}/end_run/`, {route: routeId}, config)
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

export const reachStop = (routeId, onSuccess = () => {}) => (dispatch, getState) => {
    let config = tokenConfig(getState);

    axios
    .put(`/api/bus/${routeId}/`, {previous_stop: stop}, config)
    .then((res) => {
        dispatch({
            type: ONE_RUN_SET,
            payload: res,
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
    // dispatch({
    //     type: ONE_RUN_SET,
    //     payload: EXAMPLE_ACTIVE_RUN_1,
    //   });

    axios
    .get(`/api/run/${driverId}/driver/`, config)
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

export const getActiveRuns = () => (dispatch, getState) => {
    let config = tokenConfig(getState);

    axios
    .get(`/api/run/active/`, config)
    .then((res) => {
        dispatch({
            type: MANY_RUN_SET,
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
      .get('/api/run/', config)
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

  export const getBusLocation = (busNum) => (dispatch, getState) => {
    console.log(busNum)
    let config = tokenConfigDrive(getState);
    dispatch({
        type: ADD_BUS_LOCATION,
        payload: EXAMPLE_BUS_LOCATION_1,
    });
    // axios
    //   .get(`http://tranzit.colab.duke.edu:8000/get?bus=${busNum}`)
    //   .then((res) => {
        // dispatch({
        //     type: ADD_BUS_LOCATION,
        //     payload: res.data,
        // });
    //   })
    //   .catch((err) => {/*console.log(err);*/
    // });
  
  }


  export const getBusLocations = (busNums) => (dispatch, getState) => {
    console.log(busNums)
    dispatch({
        type: RESET_BUS_LOCATIONS,
    });
    busNums.forEach(busNum => {
        console.log(busNum)
        let config = tokenConfigDrive(getState);
        dispatch({
            type: ADD_BUS_LOCATION,
            payload: EXAMPLE_BUS_LOCATION_1,
        });
    });
  }


  export const resetError = () => (dispatch, getState) => {
   
    
        dispatch({
            type: DRIVE_ERROR,
            payload: "",
        });
  
  }

