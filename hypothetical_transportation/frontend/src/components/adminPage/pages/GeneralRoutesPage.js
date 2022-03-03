import React, {useEffect} from 'react';
import Header from '../../header/AdminHeader';
import { Link, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRoutes } from '../../../actions/routes';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import "../NEWadminPage.css";
import { Container } from 'react-bootstrap'


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
    <div>
        <Header></Header>
        <Container className="container-main">
          <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
            <h1>List of Routes</h1>
          </div>
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={props.routes} tableType={tableType} search="" title={title} totalCount={props.routeCount} />
          </div>
        </Container>
    </div>
  )
}
AdminRoutesPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  routes: state.routes.routes.results,
  routeCount: state.routes.routes.count
});

export default connect(mapStateToProps, {getRoutes})(AdminRoutesPage)
