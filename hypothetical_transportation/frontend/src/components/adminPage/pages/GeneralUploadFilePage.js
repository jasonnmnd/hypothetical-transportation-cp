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
    const [loading, setLoading] = useState(false)


    const [userRes, setUserRes] = useState([]);
    const [studentRes, setStudentRes] = useState([]);

    const handleChangeUser = (e) => {
        setUserFile(e.target.files[0]);
    }
    const handleChangeStudent = (e) => {
        setStudentFile(e.target.files[0]);
    }
    const handleOnSubmit = (e) => {
        e.preventDefault();
        setLoading(true)

        props.validate(jsonRes, () => {navigate("/upload_data")})
        
    };

    useEffect(()=>{
        // console.log(typeof(userRes))
        if (userfile) {
            userReader.onload = function (event) {
                const csvOutput = event.target.result;
                setUserRes(csvJSON(csvOutput))
            };
            userReader.readAsText(userfile);
        }

        if (studentfile) {
            studentReader.onload = function (event) {
                const csvOutput = event.target.result;
                setStudentRes(csvJSON(csvOutput))
            };
            studentReader.readAsText(studentfile);
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
                    <Button variant="yellowsubmit" type="submit">
                        Submit
                    </Button>
                    {loading? 
                    <div>
                        <p>Backend processing information, please wait...</p>
                        <Spinner animation="border" role="status" size="lg">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
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
