import { combineReducers } from 'redux';
import students from './students';
import auth from "./auth";
import schools from './schools';
import errors from './errors';
import messages from './messages';

export default combineReducers({
  students,
  schools,
  auth,
  errors,
  messages
});