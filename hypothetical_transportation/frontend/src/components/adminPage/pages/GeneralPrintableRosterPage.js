import React, { Fragment, useEffect } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PlainHeader from '../../header/PlainHeader';
import { Container, Table } from 'react-bootstrap';
import { useParams } from "react-router-dom";
import { getStudents } from '../../../actions/students';
import { getRouteInfo } from '../../../actions/routes';


function GeneralPrintableRoster(props) {

  const param = useParams();

  useEffect(() => {
    props.getStudents({routes: param.route_id});
    props.getRouteInfo(param.route_id);
  }, [param.route_id]);

  const tableHeaders = [
    "Student Name",
    "Student ID",
    "Address",
    "Parent Name",
    "Parent Email",
    "Parent Phone Number"
  ]

  const mapTableColumns = () => {
    return tableHeaders.map((col) => {
      return (
        <th key={col} scope="col">
            {col}
        </th>
      )
    })
  }

  const mapTableRows = () => {
    return props.students.map((student, idx) => {
      return (
        <Fragment key={idx}>
          <tr>
            <td>{student.full_name}</td>
            <td>{student.id}</td>
            <td>{student.guardian.address}</td>
            <td>{student.guardian.full_name}</td>
            <td>{student.guardian.email}</td>
            <td>{"REPLACE WITH GUARDIAN PHONE"}</td>
          </tr>
        </Fragment>
        
      )
    })
  }

  return (           
    <>
        <PlainHeader></PlainHeader>

        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
          <Container>
            <div className="p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
              <h1>Students for {props.route.name} at {props.route.school.name}</h1>
            </div>

            <Table striped bordered size="sm">
              <thead>
                <tr>
                  {mapTableColumns()}
                </tr>
              </thead>
                
              <tbody>
                {mapTableRows()}
              </tbody>
            </Table>
          </Container>
          
        </Container>
    </>
  )
}

GeneralPrintableRoster.propTypes = {
  getRouteInfo: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  route: state.routes.viewedRoute, 
});

export default connect(mapStateToProps, {getStudents, getRouteInfo})(GeneralPrintableRoster)