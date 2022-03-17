import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap';
import AdminHeader from '../../header/AdminHeader'

function GeneralUploadFilePage() {
  const [file, setFile] = useState();

  const fileReader = new FileReader();


  const handleChange = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0])
  }
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
        fileReader.onload = function (event) {
            const csvOutput = event.target.result;
            console.log(csvOutput)
        };

        fileReader.readAsText(file);
    }
};

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