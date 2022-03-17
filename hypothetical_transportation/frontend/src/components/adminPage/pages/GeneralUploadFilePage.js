import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import AdminHeader from '../../header/AdminHeader'
import csvJSON from '../../../utils/csv_to_json'

function GeneralUploadFilePage() {
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
    const handleOnSubmit = (e) => {
        e.preventDefault();
        console.log(jsonRes)
        console.log("calling the backend validator dodododo")
        
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
            <Container className="container-main" style={{width: "50%"}} >
                <Form className="shadow-lg p-3 mb-5 bg-white rounded"  noValidate onSubmit={handleOnSubmit}>
                    <Form.Label as="h5">Select a CSV file for USER information</Form.Label>
                    <Form.Control
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleChangeUser}
                    />
                    <Form.Label as="h5">Select a CSV file for STUDENT information</Form.Label>
                    <Form.Control
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleChangeStudent}
                    />
                    <br></br>
                    <Button variant="yellowsubmit" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </div>
    )
}

export default GeneralUploadFilePage