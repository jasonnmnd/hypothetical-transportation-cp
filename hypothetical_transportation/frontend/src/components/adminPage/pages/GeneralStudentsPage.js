import React,{useEffect} from 'react';
import Header from '../../header/AdminHeader';
import { useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getStudents, searchStudents } from '../../../actions/students';
import GeneralAdminTableView from '../components/views/GeneralAdminTableView';
import "../NEWadminPage.css";
import { Container } from 'react-bootstrap'



function GeneralAdminStudentsPage(props) {
  const title = "Students"
  const tableType = "student"

  let [searchParams, setSearchParams] = useSearchParams();
  
  useEffect(() => {
    if(searchParams.get(`pageNum`) != null && !(searchParams.get(`ordering`) ==null || searchParams.get(`ordering`) =="")){
      // console.log("?>")
      let paramsToSend = Object.fromEntries([...searchParams]);
      props.getStudents(paramsToSend);
    }
    else{
      // console.log("set?")
        setSearchParams({
          ...searchParams,
          [`pageNum`]: 1,
          [`ordering`]:"full_name",
        })
    }
  }, [searchParams]);



  return (
    <div>
        <Header></Header>
        <Container className="container-main">
          <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
            <h1>All Students</h1>
          </div>
          <div className="shadow-lg p-3 mb-5 bg-white rounded">
            <GeneralAdminTableView values={props.students} tableType={tableType} search="" title={title} totalCount={props.studentCount} />
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
  students: state.students.students.results,
  studentCount: state.students.students.count
});

export default connect(mapStateToProps, {getStudents, searchStudents})(GeneralAdminStudentsPage)
