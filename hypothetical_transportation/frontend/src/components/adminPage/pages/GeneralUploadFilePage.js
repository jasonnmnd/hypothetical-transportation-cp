import React, { useEffect, useState } from 'react'
import { Alert, Button, Container, Form, Spinner } from 'react-bootstrap';
import AdminHeader from '../../header/AdminHeader'
import csvJSON from '../../../utils/csv_to_json'
import { validate } from '../../../actions/bulk_import';
import PropTypes, { string } from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import getType from '../../../utils/user2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


function GeneralUploadFilePage(props) {
    const navigate = useNavigate();
    const [userfile, setUserFile] = useState();
    const [studentfile, setStudentFile] = useState();

    const [jsonRes, setJsonRes] = useState({"users":[], "students":[]});

    const userReader = new FileReader();
    const studentReader = new FileReader();
    const [loading, setLoading] = useState(false)


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
        setLoading(true)
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
            setLoading(true)
            setWarning(false)
            props.validate(jsonRes, () => {navigate("/upload_data")})
        }
        else{

            setLoading(false)
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


    const [userOpen, setUserOpen] = useState(false);
    const [studentOpen, setStudentOpen] = useState(false);

    const handleUserClickOpen = () => {
        setUserOpen(true);
    };

    const handleUserClose = () => {
        setUserOpen(false);
    };

    const handleStudentClickOpen = () => {
        setUserOpen(true);
    };

    const handleStudentClose = () => {
        setUserOpen(false);
    };


    return (
        <div>
            <AdminHeader></AdminHeader>
            {getType(props.user) == "staff" || getType(props.user) == "admin" ?
            <Container className="container-main" style={{width: "50%"}} >
                {!loading?<Form className="shadow-lg p-3 mb-5 bg-white rounded"  noValidate onSubmit={handleOnSubmit}>
                    <Form.Label as="h5">
                        Select USER CSV file

                            <Tooltip title="Click to view documentation">
                                <IconButton onClick={handleUserClickOpen}>
                                    <InfoIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>

                            <Dialog
                                open={userOpen}
                                onClose={handleUserClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                {"Import Users Guide"}
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    When importing data for users, please make sure to follow this format:
                                    <div>
                                        <ul>
                                            <li><strong>email:</strong></li>
                                                <ul>
                                                    <li>must be {"<="} 254 characters</li>
                                                    <li>must be a valid address as per the addr-spec of RFC 5322, Section 3.4.1</li>
                                                    <li>field is not empty</li>
                                                </ul>
                                            <li><strong>name:</strong></li>
                                                <ul>
                                                    <li>must be {"<="} 150 characters</li>
                                                    <li>field is not empty</li>
                                                    <li>some text field containing both a first and last name with potential suffixes (eg Jr, Sr, III, etc)</li>
                                                </ul>
                                            <li><strong>address:</strong></li>
                                                <ul>
                                                    <li>must be {"<="} 150 characters</li>
                                                    <li>some text that is a Complete Address as per USPS Standard 602.1.4</li>
                                                    <li>field is not empty</li>
                                                </ul>
                                            <li><strong>phone_number:</strong></li>
                                                <ul>
                                                    <li>must be {"<="} 35 characters</li>
                                                    <li>field is not empty</li>
                                                </ul>
                                        </ul>
                                    </div>
                                </DialogContentText>
                                </DialogContent>
                                    <DialogActions>
                                        <Button variant='yellow' onClick={handleUserClose}>Close</Button>
                                    </DialogActions>
                            </Dialog>

                    </Form.Label>
                    <Form.Control
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleChangeUser}
                    />
                    <Form.Label as="h5">
                        Select STUDENT CSV file

                            <Tooltip title="Click to view documentation">
                                <IconButton onClick={handleStudentClickOpen}>
                                    <InfoIcon fontSize="medium" />
                                </IconButton>
                            </Tooltip>

                            <Dialog
                                open={studentOpen}
                                onClose={handleStudentClose}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                {"Import Students Guide"}
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    When importing data for students, please make sure to follow this format:
                                    <div>
                                        <ul>
                                            <li><strong>name:</strong></li>
                                                <ul>
                                                    <li>must be {"<="} 150 characters</li>
                                                    <li>field is not empty</li>
                                                    <li>some text field containing both a first and last name with potential suffixes (eg Jr, Sr, III, etc)</li>
                                                </ul>
                                            <li><strong>parent_email:</strong></li>
                                                <ul>
                                                    <li><li>must be {"<="} 254 characters as per RFC 5321, Section 4.5.3.1.3</li></li>
                                                    <li>must be a valid address as per the addr-spec of RFC 5322, Section 3.4.1</li>
                                                    <li>field is not empty</li>
                                                </ul>
                                            <li><strong>student_id:</strong></li>
                                                <ul>
                                                    <li>some non-zero, positive (but less than 2147483647) number. As this is an optional field, if there is no desired student id the field is left empty.</li>
                                                </ul>
                                            <li><strong>school_name:</strong></li>
                                                <ul>
                                                    <li>must be {"<="} 150 characters</li>
                                                    <li>school name must case-insensitively and whitespace-insensitively match an existing school name, or else the record will be rejected with an appropriate error message</li>
                                                    <li>field is not empty</li>
                                                </ul>
                                        </ul>
                                    </div>
                                </DialogContentText>
                                </DialogContent>
                                    <DialogActions>
                                        <Button variant='yellow' onClick={handleStudentClose}>Close</Button>
                                    </DialogActions>
                            </Dialog>

                    </Form.Label>
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
                    </div>: loading? 
                    <div>
                        <p>Backend processing information, please wait...</p>
                        <Spinner animation="border" role="status" size="lg">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <></>}
                </Form>:<div>
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
            }
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
