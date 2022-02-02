import React, {Fragment, useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import "../adminPage.css";
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUsers } from '../../../actions/users';
import SearchBar from '../components/searchbar/SearchBar';
import GeneralTable from '../../common/GeneralTable';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';


function GeneralAdminUsersPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Users"

  let [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getUsers(paramsToSend);
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
        <Header textToDisplay={"Users Portal"} shouldShowOptions={true}></Header>
        <div className='middle-content'>
          <GeneralAdminTableView values={props.users} tableType='user' search="" title={title} />
            <div className='center-buttons'>
                  <Link to="/admin/new/user">
                    <button className='button'> Add New User</button>
                  </Link>
            </div>
        </div>
    </div>
  )
}

GeneralAdminUsersPage.propTypes = {
    getUsers: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  users: state.users.users.results,
});

export default connect(mapStateToProps, {getUsers} )(GeneralAdminUsersPage)
