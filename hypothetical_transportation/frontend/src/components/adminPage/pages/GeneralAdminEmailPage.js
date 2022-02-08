import React, { useState } from 'react';
import Header from '../../header/Header';
import "../NEWadminPage.css";
import { Container, Form, Button } from 'react-bootstrap'; 

function GeneralAdminEmailPage() {

    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    const submit = () => {
        console.log("Submit button pressed");
    }

  return (
    <>
        <Header></Header>
        <Container className="container-main">
            <Form className="shadow-lg p-3 mb-5 bg-white rounded">
                <Form.Group className="mb-3" controlId="validationCustom01">
                    <Form.Label as="h5">Subject Title</Form.Label>
                    <Form.Control 
                    required type="text"
                    placeholder="Enter Title..." 
                    value={subject}
                    onChange={(e)=>{
                        setSubject(e.target.value)
                    }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label as="h5">Email Body</Form.Label>
                    <Form.Control 
                    as="textarea"
                    required type="text"
                    style={{ height: '300px' }}
                    placeholder="Enter Email Body..." 
                    value={body}
                    onChange={(e)=>{
                        setBody(e.target.value)
                        }}                    
                        />
                </Form.Group>

                <Button variant="yellowsubmit" type="submit" onClick={submit}>
                    Submit
                </Button>

            </Form>
        </Container>

    </>
  );
}

export default GeneralAdminEmailPage;
