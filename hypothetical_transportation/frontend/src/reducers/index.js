import { combineReducers } from 'redux';
import students from './students';
import auth from "./auth";
import schools from './schools';
import errors from './errors';
import messages from './messages';
import users from './users';
import table from './table';
import routes from './routes';
import routeplanner from './routeplanner';
import stop from './stops';

export default combineReducers({
  students,
  schools,
  auth,
  errors,
  messages,
  users,
  table,
  routeplanner,
  routes,
  stop,
});
