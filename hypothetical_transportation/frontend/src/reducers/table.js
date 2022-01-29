import { POPULATE_TABLE } from '../actions/types.js';

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
    default:
      return state;
  }
}