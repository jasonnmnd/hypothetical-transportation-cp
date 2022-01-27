import { GET_SCHOOLS, ADD_SCHOOL, DELETE_SCHOOL } from '../actions/types.js';

const initialState = {
    schools: [],
};


export default function(state = initialState, action) {
    switch(action.type) {
        case GET_SCHOOLS:
            return {
                ...state,
                schools: action.payload
            }

        default:
            return state;
    }
}