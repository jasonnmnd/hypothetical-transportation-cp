import React, {useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from '../components/table/AdminTable';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchools, searchSchools } from '../../../actions/schools';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';

function GeneralAdminSchoolsPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Schools"
  const tableType = "school"


  useEffect(() => {
    props.getSchools();
  }, []);


  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    props.searchSchools(value.by, value.value)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"}></Header>
        <div className='middle-content'>
          <div className='center-buttons'>
            <Link to="/admin/new/school">
                  <button className='button'>Add New School</button>
            </Link>
          </div>
            <GeneralAdminTableView title={title} tableType={tableType} search={search} />
        </div>
    </div>
  )
}

GeneralAdminSchoolsPage.propTypes = {
    getSchools: PropTypes.func.isRequired,
    searchSchools: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {getSchools, searchSchools})(GeneralAdminSchoolsPage)
