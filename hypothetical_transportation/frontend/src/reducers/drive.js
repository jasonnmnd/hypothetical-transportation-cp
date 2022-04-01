import { DRIVE_ERROR, MANY_RUN_SET, ONE_RUN_SET } from "../actions/types";

const initialState = {
    currentRun: {},
    manyRuns: {
        results: [],
        count: 0
    },
    errors: "",
    log: []
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
        case DRIVE_ERROR:
            return {
                ...state,
                errors: action.payload
            }
        case DRIVE_ERROR:
            return {
                ...state,
                log: action.payload
            }
        default:
            return state;
    }
}