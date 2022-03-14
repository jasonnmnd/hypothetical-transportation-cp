import AdminHeader from '../../header/AdminHeader'
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { FAKE_IMPORT_DATA, STUDENT_COLUMNS, USER_COLUMNS } from '../../../utils/bulk_import';
import BulkImportTable from '../components/bulk_import/BulkImportTable';

function GeneralUploadDataPage(props) {


  return (
    <>
      <AdminHeader></AdminHeader>
      <BulkImportTable data={props.uploadData.users} colData={USER_COLUMNS}/>
      <BulkImportTable data={props.uploadData.students} colData={STUDENT_COLUMNS}/>
    </>
  )
}

GeneralUploadDataPage.propTypes = {
  uploadData: PropTypes.object
}

GeneralUploadDataPage.defaultProps = {
  uploadData: FAKE_IMPORT_DATA
}

const mapStateToProps = (state) => ({

});



export default connect(mapStateToProps)(GeneralUploadDataPage)