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
import "../NEWadminPage.css";
import { Container, Form } from 'react-bootstrap'


function NEWAdminRoutesPage(props) {

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
    <div>
        <Header></Header>
        <Container className="container-main">
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={props.routes} tableType={tableType} search="" title={title} />
          </div>
        </Container>
    </div>
  )
}
NEWAdminRoutesPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  routes: state.routes.routes.results
});

export default connect(mapStateToProps, {getRoutes})(NEWAdminRoutesPage)
