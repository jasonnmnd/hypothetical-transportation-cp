import AdminHeader from '../../header/AdminHeader'
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { duplicatesExist, errOrDupExists, errorsExist, FAKE_IMPORT_DATA, STUDENT_COLUMNS, USER_COLUMNS } from '../../../utils/bulk_import';
import BulkImportTable from '../components/bulk_import/BulkImportTable';
import UserDetailsModal from '../components/bulk_import/UserDetailsModal';
import TransactionDetailsModal from '../components/bulk_import/TransactionDetailsModal';
import { Button, Container } from 'react-bootstrap';
import '../NEWadminPage.css';

function GeneralUploadDataPage(props) {

  const [modalInfo, setModalInfo] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState(props.uploadData);
  const [userDataChanges, setUserDataChanges] = useState({});
  const [studentDataChanges, setStudentDataChanges] = useState({});
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [changedSinceLastValidation, setChangedSinceLastValidation] = useState(false);
  

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

  const setDataWithCheckBoxes = (inData) => {
    //figure out how to set check boxes
    let newCheckedUsers = [];
    inData.users.forEach((user, ind) => {
      if(!(errorsExist(user) || duplicatesExist(user))){
        newCheckedUsers.push(ind);
      }
    });

    let newCheckedStudents = [];
    inData.students.forEach((student, ind) => {
      if(!(errorsExist(student) || duplicatesExist(student))){
        newCheckedStudents.push(ind);
      }
    });

    setCheckedUsers(newCheckedUsers);
    setCheckedStudents(newCheckedStudents);
    setData(inData);
  }

  const mounted = useRef();
  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      resetPage()
      mounted.current = true;
    } else {
      resetPage(true)
      // do componentDidUpdate logic
    }
  }, [props.data]);

  useEffect(()=>{
    setChangedSinceLastValidation(true);
  },[userDataChanges, studentDataChanges, checkedUsers, checkedStudents])

  const resetPage = (keepCheckBoxes) => {
    setModalInfo(null);
    setModalType(null);
    setUserDataChanges({});
    setStudentDataChanges({});
    if(keepCheckBoxes){
      setData(props.uploadData)
    }
    else {
      setDataWithCheckBoxes(props.uploadData);
    }
    setChangedSinceLastValidation(false);
  }

  const validate = () => {
    console.log("VALIDATE");
    setChangedSinceLastValidation(false);
  }

  const submit = () => {
    console.log("SUBMIT")
    props.uploadData.students[0].student_id = 5000
  }


  return (
    <>
      <AdminHeader></AdminHeader>

      <Container className='d-flex flex-column justify-content-center' style={{gap: "10px", marginTop: "20px"}}>
        <TransactionDetailsModal modalType={modalType} info={modalInfo} closeModal={closeModal} saveModal={saveModal} />
        
        <BulkImportTable 
          data={data.users} 
          colData={USER_COLUMNS}
          setModalInfo={setModalInfo}
          setModalType={() => setModalType("user")}
          dataChanges={userDataChanges}
          checked={checkedUsers}
          setChecked={setCheckedUsers}
          title='Users'
        />
        
        <BulkImportTable 
          data={data.students} 
          colData={STUDENT_COLUMNS}
          setModalInfo={setModalInfo}
          setModalType={() => setModalType("student")}
          dataChanges={studentDataChanges}
          checked={checkedStudents}
          setChecked={setCheckedStudents}
          title='Students'
        />
        
        <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
          <Button variant="yellow" onClick={validate}>Validate</Button>
          <Button variant="yellow" onClick={submit} disabled={changedSinceLastValidation}>Submit</Button>
          <Button variant="yellow" onClick={resetPage}>Reset</Button>
        </Container>
      </Container>
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
  uploadData: state.bulk_import
});



export default connect(mapStateToProps)(GeneralUploadDataPage)