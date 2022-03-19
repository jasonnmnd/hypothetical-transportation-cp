import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import AdminHeader from '../../header/AdminHeader'
import csvJSON from '../../../utils/csv_to_json'
import { validate } from '../../../actions/bulk_import';
import PropTypes, { string } from 'prop-types';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function GeneralUploadFilePage(props) {
    const navigate = useNavigate();
    const [userfile, setUserFile] = useState();
    const [studentfile, setStudentFile] = useState();

    const [jsonRes, setJsonRes] = useState({"users":[], "students":[]});
    const [loading, setLoading] = useState(false)

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
    const handleOnSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        console.log(jsonRes)
        console.log("calling the backend validator dodododo")
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

    useEffect(()=>{
        setLoading(false)
    },[])


    return (
        <div>
            <AdminHeader></AdminHeader>
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
                    {loading? <p>Backend processing information, please wait...</p>:<></>}
                </Form>
            </Container>
        </div>
    )
}

GeneralUploadFilePage.propTypes = {
    validate: PropTypes.func.isRequired
}

GeneralUploadFilePage.defaultProps = {
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {validate})(GeneralUploadFilePage)
