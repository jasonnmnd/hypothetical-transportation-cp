import React, {useState, useEffect} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRoutes } from '../../../actions/routes';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';

function AdminRoutesPage(props) {

  const title = "Routes"
  const tableType = "route"


  let [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getRoutes(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
  }, [searchParams]);



  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Routes Portal"} shouldShowOptions={true}></Header>
        <div className='middle-content'>
          {/* <div className='center-buttons'>
            <Link to={`/admin/new/route`}>
                <button className='button'>Add New Route</button>
              </Link>
          </div> */}
          <GeneralAdminTableView values={props.routes} search="" tableType={tableType} title={title}/>
        </div>
    </div>
  )
}
AdminRoutesPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  routes: state.routes.routes.results
});

export default connect(mapStateToProps, {getRoutes})(AdminRoutesPage)
