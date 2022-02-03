import React, {Fragment, useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import "../adminPage.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';

function AdminUsersPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Parent Users"

  const handlePrevClick = () => {
    //API Call here to get new data to display for next page
  }

  const handleNextClick = () => {
    //API Call here to get new data to display for next page
  }

  const emptyUser = [{
    full_name: "",
    email: "",
    address: "",
    groups: [],
  }]

  //const [users, setUsers] = useState(emptyUser);

  // const getUsers = () => {
  //   axios.get('/api/user/')
  //       .then(res => {
  //           console.log(res.data.results)
  //           console.log(res.data.results[0].groups)
  //           setUsers(res.data.results);
  //       }).catch(err => /*/*console.log(err)*/{}*/{});
  //   }


  const getUsers = () => {
    axios.get('/api/user/', config(props.token))
        .then(res => {
            setUsers(res.data.results);
        }).catch(err => /*console.log(err)*/{});
    }

  useEffect(() => {
    props.getUsers();
  }, []);


  const searchUser = (i1,i2,i3) => {
    // console.log(i1,i2,i3)
    let url=`/api/user/`
    if(i1==="" || i2==="" || i1===undefined || i2===undefined){
      if(i3!==""&& i3!==undefined){
        url=`/api/user/?ordering=${i3}`
      }
    }
    else{
      if(i3!=="" && i3!==undefined){
        url=`/api/user/?search=${i2}&search_fields=${i1}&ordering=${i3}`
      }
      else{
        url=`/api/user/?search=${i2}&search_fields=${i1}`
      }
    }
    // console.log(url)
    axios.get(url, config(props.token))
        .then(res => {
          setUsers(res.data.results);
        }).catch(err => /*console.log(err)*/{});
  }
  

  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    searchUser(value.filter_by, value.value, value.sort_by)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
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
              <AdminTable title={title} header={Object.keys(emptyUser[0])} data={users} search={search} sortBy={["full_name","email","-full_name","-email"]}/>
              <div className="prev-next-buttons">
                  <button onClick={handlePrevClick}>Prev</button>
                  <button onClick={handleNextClick}>Next</button> 
              </div>
          </div>
        </div>
    </div>
  )
}

AdminUsersPage.propTypes = {
    getUsers: PropTypes.func.isRequired,
    searchUsers: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps, {getUsers, searchUsers} )(AdminUsersPage)
