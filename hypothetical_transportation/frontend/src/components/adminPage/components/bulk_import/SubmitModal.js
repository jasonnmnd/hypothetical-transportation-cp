import React, { useState } from 'react';
import "../modals/modal.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Container, Modal } from 'react-bootstrap';
import BulkImportTable from './BulkImportTable';
import ErrorSection from './ErrorSection';
import { dataToValidationPayload, errorsExistMany, STUDENT_COLUMNS, USER_COLUMNS } from '../../../../utils/bulk_import';
import { resetValidateForSubmit, submit } from '../../../../actions/bulk_import';
import { useNavigate } from 'react-router-dom';



function SubmitModal(props) {
    const navigate = useNavigate();

    const [checked, setChecked] = useState(false);

    if(props.data == null || props.data == undefined){
        return null;
    }

    const closeModal = () => {
        props.resetValidateForSubmit();

    }

    const getErrors = (transactionType) => {
        let title = "";
        let showData = [];
        if(transactionType == 'user'){
            title = "User Errors"
            showData = props.data?.users
        }
        else if(transactionType == 'student'){
            title = "Student Errors"
            showData = props.data?.students
        }
        
        return (
            <>
                <h2>{title}</h2> 
                {showData.map((transaction, index) => {
                    return (<ErrorSection transaction={transaction} type={transactionType} hideDups={true} errorTitle={`Row ${index + 1}`}/>)
                })}
            </>
        )
        
    }

    const submit = () => {
        props.resetValidateForSubmit()
        props.submit(dataToValidationPayload(props.data, {}, {}));
        navigate("/upload_data/success")
    }


    return (
        <Modal dialogClassName="user-modal" show={props.data} onHide={closeModal}>
            <Modal.Header closeButton>
                <Container className='d-flex flex-row justify-content-center'>
                    <Modal.Title>Are You Sure You Want To Submit?</Modal.Title>
                </Container>
            </Modal.Header>

            <Modal.Body>
                <Container className="d-flex flex-column justify-content-center" style={{gap: "10px"}}>
                    <BulkImportTable 
                        data={props.data.users} 
                        colData={USER_COLUMNS}
                        showRowNumbers={true}
                        title='Users To Submit'
                        />
                        
                    <BulkImportTable 
                        data={props.data.students} 
                        colData={STUDENT_COLUMNS}
                        showRowNumbers={true}
                        title='Students To Submit'
                    />
                    {errorsExistMany(props.data.users) ? getErrors("user") : null}
                    {errorsExistMany(props.data.students) ? getErrors("student") : null}
                    <Container className="d-flex flex-row justify-content-center" style={{gap: "10px"}}>
                        <span style={{fontSize: "80%"}}>Confirm Changes</span>
                        <input style={{alignSelf: "center"}} type="checkbox" checked={checked} onChange={() => setChecked(!checked)} disabled={errorsExistMany(props.data.users) || errorsExistMany(props.data.students)}/>
                    </Container>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                    <Button variant="yellowclose" onClick={closeModal}>Close</Button>
                    <Button variant="yellowclose" disabled={errorsExistMany(props.data.users) || errorsExistMany(props.data.students) || !checked} onClick={submit}>Save</Button>
                </Container>
            </Modal.Footer>
        </Modal>  
    
  );
}

SubmitModal.propTypes = {
    data: PropTypes.object,
    resetValidateForSubmit: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired
    
}

const mapStateToProps = (state) => ({
  data: state.bulk_import.validateForSubmit
});

export default connect(mapStateToProps, {resetValidateForSubmit, submit})(SubmitModal)
