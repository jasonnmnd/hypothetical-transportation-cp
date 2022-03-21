import { EXPOSED_RESULT,RESET_EXPOSED_USER,REGISTER_SUCCESS,GET_USERS, DELETE_USER, ADD_USER, GET_USER,RESET_POSTED_USER} from '../actions/types.js';

const initialState = {
  users: {
      results: [
      ]
  },
  viewedUser: {
        id: null,
        full_name: "",
        email: "",
        address: "",
        groups: [{id:2}],
  },
  postedUser:{
    id: 0,
    full_name: "",
    email: "",
    address: "",
    groups: [{id:2}],
  },
  exposedUser:{
      id: 0,
      full_name: "",
      email: "",
      address: "",
      groups: [{id:2}],
  }
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case DELETE_USER:
       return {
           ...state,
           users: {
             results: state.users.results.filter(user => user.id !== action.payload)
            }
       }   
    case ADD_USER:
        return {
            ...state,
            users: {
              results: [...state.users.results, action.payload]
            },
        };
    case REGISTER_SUCCESS:
      return {
        ...state,
        users: {
          results: [...state.users.results, action.payload]
        },
        postedUser: action.payload
    };
    case RESET_POSTED_USER:
      return{
        ...state,
        postedUser:{
          id: 0,
          full_name: "",
          email: "",
          address: "",
          groups: [],
      },
    }
    case GET_USER:
      return {
        ...state,
        viewedUser: action.payload
      };
    case EXPOSED_RESULT:
      return{
        ...state,
        exposedUser: action.payload.data
      };
    case RESET_EXPOSED_USER:
      console.log(action)
      return{
        ...state,
        exposedUser:{
          id: 0,
          full_name: "",
          email: "",
          address: "",
          groups: [{id:2}],
      }
      }
    default:
      return state;
  }
}