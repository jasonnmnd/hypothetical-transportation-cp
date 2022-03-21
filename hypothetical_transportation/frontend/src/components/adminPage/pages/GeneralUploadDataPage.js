import AdminHeader from '../../header/AdminHeader'
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { dataToSubmitPayload, dataToValidationPayload, duplicatesExist, errOrDupExists, errorsExist, FAKE_IMPORT_DATA, STUDENT_COLUMNS, USER_COLUMNS } from '../../../utils/bulk_import';
import BulkImportTable from '../components/bulk_import/BulkImportTable';
import UserDetailsModal from '../components/bulk_import/UserDetailsModal';
import TransactionDetailsModal from '../components/bulk_import/TransactionDetailsModal';
import { Alert, Button, Container, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import '../NEWadminPage.css';
import { submit, validate, validateForSubmit } from '../../../actions/bulk_import';
import getType from '../../../utils/user2';
import SubmitModal from '../components/bulk_import/SubmitModal';

function GeneralUploadDataPage(props) {
  const [modalInfo, setModalInfo] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [data, setData] = useState(props.uploadData);
  const [userDataChanges, setUserDataChanges] = useState({});
  const [studentDataChanges, setStudentDataChanges] = useState({});
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [changedSinceLastValidation, setChangedSinceLastValidation] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [shouldShowValidateText, setShouldValidateText] = useState(false);


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

  const updateCheckedOnDelete = (checked, setChecked, index) => {
    let newChecked = []
    checked.forEach(transactionIndex => {
      if(transactionIndex == index){
        return;
      }
      let newIndex = transactionIndex;
      if(transactionIndex > index){
        newIndex = transactionIndex - 1
      }
      newChecked.push(newIndex);
    });
    setChecked(newChecked)
  }

  const updateDataChangesOnDelete = (dataChanges, setDataChanges, index) => {
    let newChanges = {}
    Object.keys(dataChanges).forEach(transactionIndex => {
      if(transactionIndex == index){
        return;
      }
      let newIndex = transactionIndex;
      if(transactionIndex > index){
        newIndex = transactionIndex - 1
      }
      newChanges[newIndex] = dataChanges[transactionIndex];
    });
    setDataChanges(newChanges)
  }

  const deleteRow = (transactionType, index) => {
    setData({
      ...data,
      [transactionType]: data[transactionType].filter((transaction, ind) => ind != index)
    })
    if(transactionType == 'users'){
      updateCheckedOnDelete(checkedUsers, setCheckedUsers, index)
      updateDataChangesOnDelete(userDataChanges, setUserDataChanges, index)
    }
    if(transactionType == 'students'){
      updateCheckedOnDelete(checkedStudents, setCheckedStudents, index)
      updateDataChangesOnDelete(studentDataChanges, setStudentDataChanges, index)
    }
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
    props.validateForSubmit(dataToSubmitPayload(data, userDataChanges, studentDataChanges, checkedUsers, checkedStudents)); 
    //navigate(`/upload_data/success`);
  }

  if(props.isLoading){
    return (
      <>
        <AdminHeader/>
        <Container className='d-flex flex-column justify-content-center' style={{gap: "10px", marginTop: "20px"}}>
          <div>
                <Alert variant="success">
                  <Alert.Heading>Uploading Data</Alert.Heading>
                  <p>
                    Your data is being validated, please wait....
                  </p>
                  <hr />
                    <Spinner animation="border" role="status" size="lg">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Alert>
            </div>
        </Container>
      </>

    )
         
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Please validate first before submitting
    </Tooltip>
  );

  function changeValidateTextTrue(e) {
    setShouldValidateText(true)
  }

  function changeValidateTextFalse(e) {
    setShouldValidateText(false)
  }

  return (
    <>
      
      {getType(props.user) == "staff" || getType(props.user) == "admin" ?
      <>      
      <SubmitModal />
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
          deleteRow={(index) => deleteRow("users", index)}
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
          deleteRow={(index) => deleteRow("students", index)}
        />
        
        <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
          <Button variant="yellow" onClick={validate}>Validate</Button>
          <div onMouseOver={changeValidateTextTrue} onMouseLeave={changeValidateTextFalse}>
            <Button variant="yellow" onClick={submit} disabled={changedSinceLastValidation || checkedStudents.length + checkedUsers.length == 0}>Submit</Button>
          </div>
          <Button variant="yellow" onClick={resetPage}>Reset</Button>
        </Container>

        {checkedStudents.length + checkedUsers.length == 0 && shouldShowValidateText ?
        <Container className='d-flex flex-row justify-content-center'>Please check at least one row and validate.</Container>
        :
        <></>
        }
        {checkedStudents.length + checkedUsers.length !== 0 && changedSinceLastValidation && shouldShowValidateText ?
        <Container className='d-flex flex-row justify-content-center'>Please validate before submitting.</Container>
        :
        <br></br>
        }

        <br></br>
        <br></br>
      </Container>      
      </> : <>
      <AdminHeader></AdminHeader>
      <Container className="container-main">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>
            You do not have access to this page. If you believe this is an error, contact an administrator.          
            </p>
          </Alert>
        </Container></>
        }
    </>
  )
}

GeneralUploadDataPage.propTypes = {
  uploadData: PropTypes.object,
  isLoading: PropTypes.bool,
  validate: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  validateForSubmit: PropTypes.func.isRequired
}

GeneralUploadDataPage.defaultProps = {
  uploadData: FAKE_IMPORT_DATA
}

const mapStateToProps = (state) => ({
  uploadData: state.bulk_import.uploadData,
  user: state.auth.user,
  isLoading: state.bulk_import.isLoading
});



export default connect(mapStateToProps, {validate, submit, validateForSubmit})(GeneralUploadDataPage)