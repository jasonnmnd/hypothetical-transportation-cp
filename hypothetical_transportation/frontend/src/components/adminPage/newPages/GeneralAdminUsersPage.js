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
import GeneralAdminTable from '../components/table/GeneralAdminTable';

function GeneralAdminUsersPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Parent Users"

  const handlePrevClick = () => {
    //API Call here to get new data to display for next page
    console.log("Prev Clicked");
  }

  const handleNextClick = () => {
    //API Call here to get new data to display for next page
    console.log("Next Clicked");
  }

  const emptyUser = [{
    full_name: "",
    email: "",
    address: "",
    groups: [],
  }]




  useEffect(() => {
    console.log("HELLO")
    props.getUsers();
  }, []);


  // const searchUser = (i1,i2) => {
  //   axios.get(`/api/user/?search=${i2}&search_fields=${i1}`)
  //       .then(res => {
  //         console.log(`/api/user/?search=${i2}&search_fields=${i1}`)
  //         setUsers(res.data.results);
  //       }).catch(err => console.log(err));
  // }
  

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
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
          <div className='table-and-buttons'>
                <h1>{title}</h1>
                <SearchBar buttons={Object.keys(emptyUser[0])} search={search}></SearchBar>
                <GeneralAdminTable tableType="user"/>
                <div className="prev-next-buttons">
                    <button onClick={handlePrevClick}>Prev</button>
                    <button onClick={handleNextClick}>Next</button> 
                </div>
          </div>
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
  users: state.users.users.results
});

export default connect(mapStateToProps, {getUsers, searchUsers} )(GeneralAdminUsersPage)
