 import { GET_STUDENTS, DELETE_STUDENT, ADD_STUDENT, GET_STUDENT} from '../actions/types.js';

 const initialState = {
   students: {
     results: [],
   },
  viewedStudent: {
    id: null,
    student_id: "",
    first_name: "",
    last_name: "",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
    guardianName: "",
    routeName: "",
    schoolName: "",
  }
 };

 export default function (state = initialState, action) {
   switch (action.type) {
     case GET_STUDENTS:
       return {
         ...state,
         students: action.payload,
       };
     case DELETE_STUDENT:
      return {
        ...state,
        students: {
          results: state.students.results.filter(user => user.id !== action.payload)
         }
    }   
     case ADD_STUDENT:
         return {
             ...state,
             students: [...state.students, action.payload]
         };
      case GET_STUDENT:
          return {
            ...state,
            viewedStudent: action.payload
          };
     default:
       return state;
   }
 }