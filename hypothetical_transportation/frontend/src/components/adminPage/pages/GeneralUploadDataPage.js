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

function GeneralUploadDataPage(props) {

  const navigate = useNavigate();
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
    setChangedSinceLastValidation(true);
  }

  const setCheckedFromErrorsAndDuplicates = (inData, uncheckErrors, uncheckDuplicates, newChecked) => {
    inData.forEach((transaction, ind) => {
      if(!((uncheckErrors && errorsExist(transaction)) || (uncheckDuplicates && duplicatesExist(transaction)))){
        newChecked.push(ind);
      }
    });
  }

  const setDataWithCheckBoxes = (inData, keepCheckBoxes=false, uncheckErrors=true, uncheckDuplicates=true) => {

    let newCheckedUsers = [];
    let newCheckedStudents = [];

    if(keepCheckBoxes){
      newCheckedUsers = checkedUsers.filter(userInd => {return !errorsExist(props.uploadData.users[userInd])});
      newCheckedStudents = checkedStudents.filter(studentInd => {return !errorsExist(props.uploadData.students[studentInd])});
    }
    else {
      setCheckedFromErrorsAndDuplicates(inData.users, uncheckErrors, uncheckDuplicates, newCheckedUsers);
      setCheckedFromErrorsAndDuplicates(inData.students, uncheckErrors, uncheckDuplicates, newCheckedStudents);
    }


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
      // do componentDidUpdate logic
      resetPage(true);
    }
  }, [props.uploadData]);

  const setCheckedWithChange = (newChecked, checkedFunc) => {
    checkedFunc(newChecked);
    setChangedSinceLastValidation(true);
  }


  

  const resetPage = (keepCheckBoxes=false) => {
    setModalInfo(null);
    setModalType(null);
    setUserDataChanges({});
    setStudentDataChanges({});
    
    setDataWithCheckBoxes(props.uploadData, keepCheckBoxes);

    setChangedSinceLastValidation(false);
  }

  const validate = () => {
    props.validate(dataToValidationPayload(data, userDataChanges, studentDataChanges));
  }

  const submit = () => {
    props.submit(dataToSubmitPayload(data, userDataChanges, studentDataChanges, checkedUsers, checkedStudents)); 
    navigate(`/upload_data/success`);
  }

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
        <TransactionDetailsModal modalType={modalType} info={modalInfo} closeModal={closeModal} saveModal={saveModal} />
        
        <BulkImportTable 
          data={data.users} 
          colData={USER_COLUMNS}
          setModalInfo={setModalInfo}
          setModalType={() => setModalType("user")}
          dataChanges={userDataChanges}
          checked={checkedUsers}
          setChecked={(checked) => setCheckedWithChange(checked, setCheckedUsers)}
          title='Users'
        />
        
        <BulkImportTable 
          data={data.students} 
          colData={STUDENT_COLUMNS}
          setModalInfo={setModalInfo}
          setModalType={() => setModalType("student")}
          dataChanges={studentDataChanges}
          checked={checkedStudents}
          setChecked={(checked) => setCheckedWithChange(checked, setCheckedStudents)}
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
  uploadData: PropTypes.object,
  isLoading: PropTypes.bool,
  validate: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired
}

GeneralUploadDataPage.defaultProps = {
  uploadData: FAKE_IMPORT_DATA
}

const mapStateToProps = (state) => ({
  uploadData: state.bulk_import.uploadData,
  isLoading: state.bulk_import.isLoading
});



export default connect(mapStateToProps, {validate, submit})(GeneralUploadDataPage)