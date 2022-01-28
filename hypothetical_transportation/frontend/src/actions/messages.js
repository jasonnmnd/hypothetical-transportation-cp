import { CREATE_MESSAGE, GET_ERRORS } from './types';

// CREATE MESSAGE
export const createMessage = (msg) => {
  console.log("CREATING");
  return {
    type: CREATE_MESSAGE,
    payload: msg,
  };
};

// RETURN ERRORS
export const returnErrors = (msg, status) => {
  console.log("ERRORING");
  return {
    type: GET_ERRORS,
    payload: { msg, status },
  };
};