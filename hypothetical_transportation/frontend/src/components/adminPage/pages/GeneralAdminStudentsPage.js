import React,{useEffect, useState} from 'react';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import Header from '../../header/Header';
import AdminTable from "../components/table/AdminTable";
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStudents, searchStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import PaginationButtons from '../../common/PaginationButtons';
import "../NEWadminPage.css";
import { Container, Form } from 'react-bootstrap'



function GeneralAdminStudentsPage(props) {
  const title = "Students"
  const tableType = "student"

  let [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getStudents(paramsToSend);
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
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={props.students} tableType={tableType} search="" title={title} />
          </div>
        </Container>
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
