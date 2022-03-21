import AdminHeader from '../../header/AdminHeader'
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { dataToSubmitPayload, dataToValidationPayload, duplicatesExist, errOrDupExists, errorsExist, FAKE_IMPORT_DATA, STUDENT_COLUMNS, USER_COLUMNS } from '../../../utils/bulk_import';
import BulkImportTable from '../components/bulk_import/BulkImportTable';
import UserDetailsModal from '../components/bulk_import/UserDetailsModal';
import TransactionDetailsModal from '../components/bulk_import/TransactionDetailsModal';
import { Button, Container, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import '../NEWadminPage.css';
import { submit, validate } from '../../../actions/bulk_import';
import { Link } from 'react-router-dom';
import getType from '../../../utils/user2';
import { Alert } from 'react-bootstrap';

function GeneralBulkImportSuccessPage(props) {
  if(props.isLoading){
    return (
      <div>
          <Alert variant="success">
            <Alert.Heading>Uploading Data</Alert.Heading>
            <p>
              Your data is being submitted, please wait....
            </p>
            <hr />
              <Spinner animation="border" role="status" size="lg">
                  <span className="visually-hidden">Loading...</span>
              </Spinner>
          </Alert>

      </div>
    )
  }

  return (
    <>
      <AdminHeader></AdminHeader>

      <Container className='d-flex flex-column justify-content-center' style={{gap: "10px", marginTop: "20px"}}>

        <ToastContainer>
          <Toast style={{width: "2000px"}}>
            {/* <Toast.Header closeButton={false} >
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">Entries Added</strong>
              <small>just now</small>
            </Toast.Header> */}
            <Toast.Body><h5>{props.successfulSubmit.num_users} Users were added</h5></Toast.Body>
          </Toast>
          <Toast style={{width: "2000px"}}>
            {/* <Toast.Header closeButton={false}>
              <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
              <strong className="me-auto">Entries Added</strong>
              <small>just now</small>
            </Toast.Header> */}
            <Toast.Body><h5>{props.successfulSubmit.num_students} Students were added</h5></Toast.Body>
          </Toast>
        </ToastContainer>

        <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
          <Link to={`/${getType(props.user)}/users?pageNum=1`}>
            <Button variant="yellow" size="lg">View Users</Button>
          </Link>

          <Link to={`/${getType(props.user)}/students?pageNum=1`}>
            <Button variant="yellow" size="lg">View Students</Button>
          </Link>
        </Container>

      </Container>
    </>
  )
}

GeneralBulkImportSuccessPage.propTypes = {
  successfulSubmit: PropTypes.object,
  isLoading: PropTypes.bool,
}

GeneralBulkImportSuccessPage.defaultProps = {
  
}

const mapStateToProps = (state) => ({
  successfulSubmit: state.bulk_import.successfulSubmit,
  isLoading: state.bulk_import.isLoading,
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});



export default connect(mapStateToProps)(GeneralBulkImportSuccessPage)