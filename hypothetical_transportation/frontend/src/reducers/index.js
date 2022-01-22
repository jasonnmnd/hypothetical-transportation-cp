import { combineReducers } from 'redux';
import students from './students';
import auth from "./auth";

export default combineReducers({
  students,
  auth
});