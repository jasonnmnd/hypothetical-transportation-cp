import { CREATE_MESSAGE, GET_ERRORS } from './types';

// CREATE MESSAGE
export const createMessage = (msg) => {
  return {
    type: CREATE_MESSAGE,
    payload: msg,
  };
};

export const createMessageDispatch = (msg) => (dispatch) => {
  dispatch(createMessage(msg))
}

// RETURN ERRORS
export const returnErrors = (msg, status) => {
  return {
    type: GET_ERRORS,
    payload: { msg, status },
  };
};