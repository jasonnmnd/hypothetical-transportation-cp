import { GET_ROUTES } from '../actions/types.js';

const initialState = {
    routes: {
        results:[],
    }
};


export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ROUTES:
            return {
                ...state,
                routes: action.payload
            }

        default:
            return state;
    }
}