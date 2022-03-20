import AdminHeader from '../../header/AdminHeader'
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { dataToSubmitPayload, dataToValidationPayload, duplicatesExist, errOrDupExists, errorsExist, FAKE_IMPORT_DATA, STUDENT_COLUMNS, USER_COLUMNS } from '../../../utils/bulk_import';
import BulkImportTable from '../components/bulk_import/BulkImportTable';
import UserDetailsModal from '../components/bulk_import/UserDetailsModal';
import TransactionDetailsModal from '../components/bulk_import/TransactionDetailsModal';
import { Button, Container, Spinner } from 'react-bootstrap';
import '../NEWadminPage.css';
import { submit, validate } from '../../../actions/bulk_import';

function GeneralBulkImportSuccessPage(props) {
  if(props.isLoading){
    return <div>
    <p>Backend processing information, please wait...</p>
    <Spinner animation="border" role="status" size="lg">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
</div>
  }

  return (
    <>
      <AdminHeader></AdminHeader>

      <Container className='d-flex flex-column justify-content-center' style={{gap: "10px", marginTop: "20px"}}>
        <h3>{props.successfulSubmit.num_users} Users were Added</h3>
        <h3>{props.successfulSubmit.num_students} Students were Added</h3>
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
  isLoading: state.bulk_import.isLoading
});



export default connect(mapStateToProps)(GeneralBulkImportSuccessPage)