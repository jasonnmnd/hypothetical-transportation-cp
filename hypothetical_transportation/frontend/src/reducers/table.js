import { POPULATE_TABLE, DELETE_ITEM } from '../actions/types.js';

const initialState = {
  values: {
      results: [
      ]
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POPULATE_TABLE:
      return {
        ...state,
        values: action.payload,
      };
    case DELETE_ITEM:
      return {
        ...state,
        values: {
          results: state.values.results.filter(value => value.id !== action.payload)
        } 
      }
    default:
      return state;
  }
}