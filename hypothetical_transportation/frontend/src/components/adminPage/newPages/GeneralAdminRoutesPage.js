import React, {useState, useEffect} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRoutes, searchRoutes } from '../../../actions/routes';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';

function AdminRoutesPage(props) {

  const title = "Routes"
  const tableType = "route"


  useEffect(() => {
    props.getRoutes();
  }, []);


  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    props.searchRoutes(value.by, value.value);
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-content'>
          {/* <div className='center-buttons'>
            <Link to={`/admin/new/route`}>
                <button className='button'>Add New Route</button>
              </Link>
          </div> */}
          <GeneralAdminTableView values={props.routes} search={search} tableType={tableType} title={title}/>
        </div>
    </div>
  )
}
AdminRoutesPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
    searchRoutes: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  routes: state.routes.routes.results
});

export default connect(mapStateToProps, {getRoutes, searchRoutes})(AdminRoutesPage)
