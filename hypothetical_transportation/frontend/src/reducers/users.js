import { GET_USERS, DELETE_USER, ADD_USER, GET_USER} from '../actions/types.js';

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
        groups: [],
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
            }
        };
    case GET_USER:
      return {
        ...state,
        viewedUser: action.payload
      };
    default:
      return state;
  }
}