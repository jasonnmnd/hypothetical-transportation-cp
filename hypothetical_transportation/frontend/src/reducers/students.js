 import { GET_IN_RANGE_STOP,GET_STUDENTS, DELETE_STUDENT, ADD_STUDENT, GET_STUDENT, UPDATE_STUDENT} from '../actions/types.js';

 const initialState = {
   students: {
     results: [],
   },
  viewedStudent: {
    id: null,
    student_id: "",
    full_name: "",
    address: "",
    guardian: 0,
    routes: 0,
    school: 0,
    guardianName: "",
    routeName: "",
    schoolName: "",
  },
  inRangeStops:{
    count:0,
    results:[]}
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
             students: {
               results: [...state.students.results, action.payload]
             }
         };
      case GET_STUDENT:
          return {
            ...state,
            viewedStudent: action.payload
          };
      case GET_IN_RANGE_STOP:
        return {
          ...state,
          inRangeStops: action.payload
        };

     default:
       return state;
   }
 }