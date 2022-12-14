import { GET_STUDENTS_IN_ROUTE, GET_STUDENTS_WITHOUT_ROUTE, ADD_ROUTE,RESET_POSTED, AUTO_GROUP_LOADING, LOAD_SHIT } from '../actions/types.js';


const initialState = {
    studentsInRoute: {
        results: [],
    },

    studentsWithoutRoute: {
        results: [],
    },

    postedRoute:{
        id: 0,
        name: "",
        description: "",
        school: "",
        schoolName: ""
    },
    loading: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_STUDENTS_IN_ROUTE:
            return {
                ...state,
                studentsInRoute: action.payload,
            };
        case GET_STUDENTS_WITHOUT_ROUTE:
            return {
                ...state,
                studentsWithoutRoute: action.payload
            }
        case ADD_ROUTE:
            return{
                ...state,
                postedRoute: action.payload
            }
        case RESET_POSTED:
            return{
                ...state,
                postedRoute: {
                    id: 0,
                    name: "",
                    description: "",
                    school: "",
                    schoolName: ""
                }
            }
        case LOAD_SHIT:
            return {
                ...state, 
                loading: action.payload
            }
        default: 
            return state;
    }

}