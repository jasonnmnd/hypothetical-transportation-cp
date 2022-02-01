import React,{useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from "../components/table/AdminTable";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStudents, searchStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import PaginationButtons from '../../common/PaginationButtons';

function GeneralAdminStudentsPage(props) {

  const title = "Students"
  const tableType = "student"
  
  const [currentPage, setPage] = useState(0)

  useEffect(() => {
    props.getStudents(currentPage);
  }, [currentPage]);


  const search = (value)=>{
    //somehow get backend to update data (with usestate?)
    props.searchStudents(value.filter_by, value.value, value.sort_by)
  }

  return (
    <div className='admin-page'>
        <SidebarSliding/>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <div className='middle-content'>
          <div className='center-buttons'>
            <Link to="/admin/new_student/">
              <button className='button'>Add New Student</button>
            </Link>          
          </div>
          <GeneralAdminTableView values={props.students} title={title} tableType={tableType} search={search} />
          <PaginationButtons currentPage={currentPage} setCurrentPage={setPage}/>
        </div>
    </div>
    
  )
}
GeneralAdminStudentsPage.propTypes = {
    getStudents: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  students: state.students.students.results
});

export default connect(mapStateToProps, {getStudents, searchStudents})(GeneralAdminStudentsPage)
