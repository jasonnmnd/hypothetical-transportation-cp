import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import AdminHeader from '../../header/AdminHeader'
import csvJSON from '../../../utils/csv_to_json'

function GeneralUploadFilePage() {
    const [file, setFile] = useState();

    const fileReader = new FileReader();
    const [jsonRes, setJsonRes] = useState();

    const handleChange = (e) => {
        setFile(e.target.files[0]);
        // console.log(e.target.files[0])
    }
    const handleOnSubmit = (e) => {
        e.preventDefault();

        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                setJsonRes(csvJSON(csvOutput))
            };

            fileReader.readAsText(file);
        }
    };

    useEffect(()=>{
        if(jsonRes!==undefined) {
            console.log(jsonRes)
        }
    },[jsonRes])


    return (
        <div>
            <AdminHeader></AdminHeader>
            <Container className="container-main" style={{width: "50%"}} >
                <Form className="shadow-lg p-3 mb-5 bg-white rounded"  noValidate onSubmit={handleOnSubmit}>
                    <Form.Label as="h5">Select a CSV file to upload to the server</Form.Label>
                    <Form.Control
                        type={"file"}
                        id={"csvFileInput"}
                        accept={".csv"}
                        onChange={handleChange}
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