import { ADD_BUS_LOCATION, DRIVE_ERROR, GET_LOG, MANY_RUN_SET, ONE_RUN_SET, SET_NEXT_STOP } from "../actions/types";

const initialState = {
    currentRun: {},
    manyRuns: {
        results: [],
        count: 0
    },
    error: "",
    log: {
        results: [],
        count: 0
    },
    busLocations: {},
    nextStop: null
};


export default function(state = initialState, action) {
    switch(action.type) {
        case ONE_RUN_SET:
            return {
                ...state,
                currentRun: action.payload
            }
        case MANY_RUN_SET:
            return {
                ...state,
                manyRuns: action.payload
            }
        case GET_LOG:
            return {
                ...state,
                log: action.payload
            }
        case DRIVE_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case DRIVE_ERROR:
            return {
                ...state,
                log: action.payload
            }
        case ADD_BUS_LOCATION: 
            return {
                ...state,
                busLocations: {
                    ...state.busLocations,
                    [action.payload.bus]: {
                        latitude: action.payload.lat,
                        longitude: action.payload.lng
                    }
                }
            }
        case ADD_BUS_LOCATION: 
            return {
                ...state,
                busLocations: {}
            }
        case SET_NEXT_STOP: 
            return {
                ...state,
                nextStop: action.payload
            }
        default:
            return state;
    }
}