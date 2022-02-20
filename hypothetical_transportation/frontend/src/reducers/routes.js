import { ADD_ROUTE, DELETE_ROUTE, GET_ROUTE, GET_ROUTES, RESET_VIEWED_ROUTE, UPDATE_ROUTE } from '../actions/types.js';

const initialState = {
    routes: {
        results:[],
    },
    viewedRoute: {
        id: 0,
        name: "",
        description: "",
        school: {
            name: "",
            address: "Durham, NC",
            id: -1,
            latitude: "36",
            longitude: "70",
        },
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
        case ADD_ROUTE:
            return {
                ...state,
                routes: {
                  results: [...state.routes.results, action.payload]
                }
            };
       
        case RESET_VIEWED_ROUTE:
            return {
                ...state,
                viewedRoute: {
                    id: 0,
                    name: "",
                    description: "",
                    school: {
                        name: "",
                        address: "Durham, NC",
                        id: -1,
                        latitude: "36",
                        longitude: "70",
                    },
                    schoolName: ""
                }
            }
        default:
            return state;
    }
}