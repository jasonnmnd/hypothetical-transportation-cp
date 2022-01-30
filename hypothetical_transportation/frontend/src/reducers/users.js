import { GET_USERS, DELETE_USER, ADD_USER, GET_USER} from '../actions/types.js';

const initialState = {
  users: {
      results: [
      ]
  },
  viewedUser: {
    results: [

    ]
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
           users: state.users.filter(user => user.id !== action.payload)
       }   
    case ADD_USER:
        return {
            ...state,
            users: [...state.users, action.payload]
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