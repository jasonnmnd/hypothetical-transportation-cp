import { GET_SCHOOLS, ADD_SCHOOL, DELETE_SCHOOL, GET_SCHOOL } from '../actions/types.js';

const initialState = {
    schools: {
        results:[],
    },
    viewedSchool: {
        id: null,
        name: "",
        address: "",
  }
};


export default function(state = initialState, action) {
    switch(action.type) {
        case GET_SCHOOLS:
            return {
                ...state,
                schools: action.payload
            }
        case GET_SCHOOL:
            return {
                ...state,
                viewedSchool: action.payload
              };
        case DELETE_SCHOOL:
            return {
                ...state,
                schools: {
                    results: state.schools.results.filter(school => school.id !== action.payload)
                }
            }
        default:
            return state;
    }
}