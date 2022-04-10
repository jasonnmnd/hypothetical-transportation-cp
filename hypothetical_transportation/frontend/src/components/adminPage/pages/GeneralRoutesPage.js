import React, {useEffect, useState} from 'react';
import Header from '../../header/AdminHeader';
import { Link, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRoutes } from '../../../actions/routes';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import "../NEWadminPage.css";
import { Container } from 'react-bootstrap'
import { getUsers } from '../../../actions/users';


function AdminRoutesPage(props) {

  const title = "Routes"
  const tableType = "route"
  const [routes, setRoutes] = useState([])


  let [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if(searchParams.get(`pageNum`) != null && !(searchParams.get(`ordering`) ==null || searchParams.get(`ordering`) =="")){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getRoutes(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
        [`ordering`]: "name",
      })
    }
    props.getUsers();
  }, [searchParams]);


  useEffect(() => {
    var lis = props.routes
    if(props.routes!==null && props.routes!==undefined && props.routes!==0 && props.users!==null && props.users!==undefined && props.users!==0 ){
        lis = []
        const x = props.routes.map((item)=> {
            return ({...item, ['driver']: item.driver!==null ? (props.users.filter((i)=>i.id==item.driver)[0]!==undefined? props.users.filter((i)=>i.id===item.driver)[0].full_name:item.driver): null, ['bus_number']: item.driver!==null ? item.bus_number : null})
        })    
        lis = [...lis, ...x]
    }
    // console.log(opt)
    setRoutes(lis)
  }, [props.routes, props.users]);



  return (
    <div>
        <Header></Header>
        <Container className="container-main">
          <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
            <h1>All Routes</h1>
          </div>
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={routes} tableType={tableType} search="" title={title} totalCount={props.routeCount} />
          </div>
        </Container>
    </div>
  )
}
AdminRoutesPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  routes: state.routes.routes.results,
  users: state.users.users.results,
  routeCount: state.routes.routes.count
});

export default connect(mapStateToProps, {getRoutes, getUsers})(AdminRoutesPage)
