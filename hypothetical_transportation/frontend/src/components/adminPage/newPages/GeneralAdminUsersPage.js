import React, {Fragment, useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import "../adminPage.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUsers, searchUsers } from '../../../actions/users';
import SearchBar from '../components/searchbar/SearchBar';
import GeneralTable from '../../common/GeneralTable';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';

function GeneralAdminUsersPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Parent Users"


  useEffect(() => {
    props.getUsers();
  }, []);

  

  const search = (value)=>{
    props.searchUsers(value.by, value.value)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-content'>
            <div className='add-new-users-buttons'>
                  <Link to="/admin/new/admin_user">
                    <button className='button'> Add New Admin</button>
                  </Link>
                  <Link to="/admin/new/parent_user">
                    <button className='button'> Add New Parent</button>
                  </Link>
              </div>
          <GeneralAdminTableView values={props.users} tableType='user' search={search} title={title} />
        </div>
    </div>
  )
}

GeneralAdminUsersPage.propTypes = {
    getUsers: PropTypes.func.isRequired,
    searchUsers: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  users: state.users.users.results,
});

export default connect(mapStateToProps, {getUsers, searchUsers} )(GeneralAdminUsersPage)
