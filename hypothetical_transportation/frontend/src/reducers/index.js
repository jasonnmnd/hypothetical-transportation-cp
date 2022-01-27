import { combineReducers } from 'redux';
import students from './students';
import auth from "./auth";
import schools from './schools';

export default combineReducers({
  students,
  schools,
  auth
});