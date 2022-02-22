import { DELETE_STOP, GET_STOPS, GET_STOP, ADD_STOP } from '../actions/types.js';

const initialState = {
    stops: {
        results:[],
    },
    viewedStop: {
    },
    postedStop: {

    },
};


export default function(state = initialState, action) {
    switch(action.type) {
        case GET_STOPS:
            return {
                ...state,
                stops: action.payload
            }
        case GET_STOP:
            return {
                ...state,
                viewedStop: action.payload
            }
        case DELETE_STOP:
            return {
                ...state,
                stops: {
                  results: state.stops.results.filter(stop => stop.id !== action.payload)
                 }
            }   
        case ADD_STOP:
            return{
                ...state,
                postedStop: action.payload
            }
        default:
            return state;
    }
}