import AdminHeader from '../../header/AdminHeader'
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { FAKE_IMPORT_DATA, STUDENT_COLUMNS, USER_COLUMNS } from '../../../utils/bulk_import';
import BulkImportTable from '../components/bulk_import/BulkImportTable';
import UserDetailsModal from '../components/bulk_import/UserDetailsModal';
import TransactionDetailsModal from '../components/bulk_import/TransactionDetailsModal';

function GeneralUploadDataPage(props) {

  const [modalInfo, setModalInfo] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState(props.uploadData);
  const [userDataChanges, setUserDataChanges] = useState({});
  const [studentDataChanges, setStudentDataChanges] = useState({});
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  

  useEffect(()=>{
    setData(props.uploadData)
  },[props.data])


  const closeModal = () => {
    setModalInfo(null)
    setModalType(null)
  }



  const saveModal = (newInfo) => {

    
    const {index, ...newInfoNoInd} = newInfo 


    if(modalType == 'user'){
      setUserDataChanges({
        ...userDataChanges,
        [index]: newInfoNoInd
      })
    }

    if(modalType == 'student'){
      setStudentDataChanges({
        ...studentDataChanges,
        [index]: newInfoNoInd
      })
    }

    closeModal();
    
    


  }



  return (
    <>
      <AdminHeader></AdminHeader>
      <TransactionDetailsModal modalType={modalType} info={modalInfo} closeModal={closeModal} saveModal={saveModal} />
      <h2>Users</h2>
      <BulkImportTable 
        data={data.users} 
        colData={USER_COLUMNS}
        setModalInfo={setModalInfo}
        setModalType={() => setModalType("user")}
        dataChanges={userDataChanges}
        checked={checkedUsers}
        setChecked={setCheckedUsers}
      />
      <h2>Students</h2>
      <BulkImportTable 
        data={data.students} 
        colData={STUDENT_COLUMNS}
        setModalInfo={setModalInfo}
        setModalType={() => setModalType("student")}
        dataChanges={studentDataChanges}
        checked={checkedStudents}
        setChecked={setCheckedStudents}
      />
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