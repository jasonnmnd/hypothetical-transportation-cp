import { GET_STUDENTS_IN_ROUTE, GET_STUDENTS_WITHOUT_ROUTE, ADD_ROUTE } from '../actions/types.js';


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
    }
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
        default: 
            return state;
    }

}