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
import bulk_import from './bulk_import';
import drive from './drive';

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
  bulk_import,
  drive
});
