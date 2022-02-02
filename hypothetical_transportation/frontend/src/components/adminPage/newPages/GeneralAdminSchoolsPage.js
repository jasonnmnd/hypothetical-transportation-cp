import React, {useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import { Link, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSchools } from '../../../actions/schools';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';

function GeneralAdminSchoolsPage(props) {

  //Mock Users Data (API Call later for real data)
  const title = "Schools"
  const tableType = "school"


  let [searchParams, setSearchParams] = useSearchParams();
  

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getSchools(paramsToSend);
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
        <Header textToDisplay={"Schools Portal"} shouldShowOptions={true}></Header>
        <div className='middle-content'>
            <GeneralAdminTableView values={props.schools} title={title} tableType={tableType} search="" />
            <div className='center-buttons'>
              <Link to="/admin/new/school">
                    <button className='button'>Add New School</button>
              </Link>
            </div>
        </div>
    </div>
  )
}

GeneralAdminSchoolsPage.propTypes = {
    getSchools: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  schools: state.schools.schools.results
});

export default connect(mapStateToProps, {getSchools})(GeneralAdminSchoolsPage)
