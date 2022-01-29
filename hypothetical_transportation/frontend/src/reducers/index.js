import { combineReducers } from 'redux';
import students from './students';
import auth from "./auth";
import schools from './schools';
import errors from './errors';
import messages from './messages';
import users from './users';

export default combineReducers({
  students,
  schools,
  auth,
  errors,
  messages,
  users
});