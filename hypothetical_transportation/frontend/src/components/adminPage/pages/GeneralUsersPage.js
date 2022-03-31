import React, { useEffect} from 'react';
import Header from '../../header/AdminHeader';
import "../NEWadminPage.css";
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUsers } from '../../../actions/users';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import { Container } from 'react-bootstrap'


function GeneralAdminUsersPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Parent Users"
  const tableType = "user"

  let [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if(searchParams.get(`pageNum`) != null  && !(searchParams.get(`ordering`) ==null || searchParams.get(`ordering`) =="")){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getUsers(paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
        [`ordering`]: "full_name",
      })
    }
  }, [searchParams]);

  return (
    <div>
        <Header></Header>
        <Container className="container-main">
          <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
            <h1>All Users</h1>
          </div>
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={props.users} tableType={tableType} search="" title={title} totalCount={props.userCount}/>
          </div>
        </Container>
    </div>
  )
}

GeneralAdminUsersPage.propTypes = {
    getUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  users: state.users.users.results,
  userCount: state.users.users.count
});

export default connect(mapStateToProps, {getUsers} )(GeneralAdminUsersPage)
