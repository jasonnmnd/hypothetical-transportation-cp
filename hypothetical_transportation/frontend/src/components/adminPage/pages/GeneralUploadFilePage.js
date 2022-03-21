import React, { useEffect, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import AdminHeader from '../../header/AdminHeader'
import csvJSON from '../../../utils/csv_to_json'
import { validate } from '../../../actions/bulk_import';
import PropTypes, { string } from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import getType from '../../../utils/user2';

function GeneralUploadFilePage(props) {
    const navigate = useNavigate();
    const [userfile, setUserFile] = useState();
    const [studentfile, setStudentFile] = useState();

    const [jsonRes, setJsonRes] = useState({"users":[], "students":[]});

    const userReader = new FileReader();
    const studentReader = new FileReader();


    const [userRes, setUserRes] = useState([]);
    const [studentRes, setStudentRes] = useState([]);

    const handleChangeUser = (e) => {
        setUserFile(e.target.files[0]);
    }
    const handleChangeStudent = (e) => {
        setStudentFile(e.target.files[0]);
    }
    const expectedUserHeader = ['email', 'full_name', 'address', 'phone_number']
    const expectedStudentHeader = ['full_name', 'parent_email', 'student_id', 'school_name']
    const [warning, setWarning] = useState(false)
    const handleOnSubmit = (e) => {
        e.preventDefault();
        var userOK=false;
        var studentOK=false;
        if(jsonRes.users.length>0){
            if(JSON.stringify(expectedUserHeader) == JSON.stringify(Object.keys(jsonRes.users[0]))){
                userOK=true;
            }
        }else{
            userOK=true;
        }


        if(jsonRes.students.length>0){
            console.log(jsonRes.students[0])
            if(JSON.stringify(expectedStudentHeader) == JSON.stringify(Object.keys(jsonRes.students[0]))){
                studentOK=true;
            }
        }else{
            studentOK=true;
        }
        if(userOK && studentOK){
            setWarning(false)
            props.validate(jsonRes)
            navigate("/upload_data")
        }
        else{
            setWarning(true);
        }
        
    };

    useEffect(()=>{
        // console.log(typeof(userRes))
        if (userfile) {
            userReader.onload = function (event) {
                const csvOutput = event.target.result;
                setUserRes(csvJSON(csvOutput))
            };
            userReader.readAsText(userfile);
        }else{
            setUserRes([])
        }

        if (studentfile) {
            studentReader.onload = function (event) {
                const csvOutput = event.target.result;
                setStudentRes(csvJSON(csvOutput))
            };
            studentReader.readAsText(studentfile);
        }else{
            setStudentRes([])
        }
    },[userfile, studentfile])


    useEffect(()=>{
        // console.log(typeof(userRes))
        setJsonRes({"users":userRes, "students":studentRes})
    },[userRes,studentRes])




    return (
        <div>
            <AdminHeader></AdminHeader>
            {getType(props.user) == "staff" || getType(props.user) == "admin" ?
            <Container className="container-main" style={{width: "50%"}} >
                <Form className="shadow-lg p-3 mb-5 bg-white rounded"  noValidate onSubmit={handleOnSubmit}>
                    <Form.Label as="h5">Select USER CSV file</Form.Label>
                    <Form.Control
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleChangeUser}
                    />
                    <Form.Label as="h5">Select STUDENT CSV file</Form.Label>
                    <Form.Control
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleChangeStudent}
                    />
                    <p>You can leave either of the above fields blank to import only student/user data.</p>
                    <Button variant="yellowsubmit" type="submit" disabled={jsonRes.users.length == 0 && jsonRes.students.length == 0}>
                        Submit
                    </Button>
                    {warning? <div>
                        <p>The CSV you uploaded does not match our criteria</p>
                        <p>User CSV is expected to have  "email","name", "address", "phone_number" fields, in this order</p>
                        <p>Student CSV is expected to have "name", "parent_email", "student_id", "school_name" fields, in this order</p>
                        <p>Please double check the files you are uploading before continuing</p>
                    </div>: 
                    <></>}
                </Form>
            </Container> : <Container className="container-main">
                <Alert variant="danger">
                  <Alert.Heading>Access Denied</Alert.Heading>
                  <p>
                    You do not have access to this page. If you believe this is an error, contact an administrator.          
                    </p>
                  </Alert>
                </Container>
                }
        </div>
    )
}

GeneralUploadFilePage.propTypes = {
    validate: PropTypes.func.isRequired
}

GeneralUploadFilePage.defaultProps = {
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps, {validate})(GeneralUploadFilePage)
