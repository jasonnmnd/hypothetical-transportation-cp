import React from 'react';
import "../modals/modal.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Container, Modal } from 'react-bootstrap';
import BulkImportTable from './BulkImportTable';
import ErrorSection from './ErrorSection';
import { dataToValidationPayload, errorsExistMany, STUDENT_COLUMNS, USER_COLUMNS } from '../../../../utils/bulk_import';
import { resetValidateForSubmit, submit } from '../../../../actions/bulk_import';



function SubmitModal(props) {
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
                    <ErrorSection transaction={transaction} type={transactionType} hideDups={true} errorTitle={`Row ${index}`}/>
                })}
            </>
        )
        
    }

    const submit = () => {
        props.submit(dataToValidationPayload(props.data, {}, {}));
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
                    {errorsExistMany(props.data.users) ? getErrors("users") : null}
                    {errorsExistMany(props.data.students) ? getErrors("students") : null}
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Container className='d-flex flex-row justify-content-center' style={{gap: "10px"}}>
                    <Button variant="yellowclose" onClick={closeModal}>Close</Button>
                    <Button variant="yellowclose" onClick={submit}>Save</Button>
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
