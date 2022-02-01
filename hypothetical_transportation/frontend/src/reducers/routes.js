import { DELETE_ROUTE, GET_ROUTE, GET_ROUTES } from '../actions/types.js';

const initialState = {
    routes: {
        results:[],
    },
    viewedRoute: {
        id: 0,
        name: "",
        description: "",
        school: "",
        schoolName: ""
    }
};


export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ROUTES:
            return {
                ...state,
                routes: action.payload
            }
        case GET_ROUTE:
            return {
                ...state,
                viewedRoute: action.payload
            }
        case DELETE_ROUTE:
            return {
                ...state,
                routes: {
                  results: state.routes.results.filter(route => route.id !== action.payload)
                 }
            }   
        default:
            return state;
    }
}