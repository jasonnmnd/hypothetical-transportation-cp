import React from 'react';
import Header from '../../header/Header';
import { Container, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import "../NEWadminPage.css"

function GeneralEditRouteForm() {

    const emptyRoute = {
        id: 0,
        name: "",
        description: "",
        // school: param.school_id,
    }
    const [obj, setObj] = useState(emptyRoute)
    
  return (
      <div>
          <Header></Header>
          <Container className="container-main">
            <Form className="shadow-lg p-3 mb-5 bg-white rounded">
                <Form.Group className="mb-3" controlId="validationCustom01">
                    <Form.Label as="h5">Name of Route</Form.Label>
                    <Form.Control 
                    required type="text"
                    placeholder="Enter Route Name..." 
                    value={obj.name}
                    onChange={(e)=>{
                        setObj({...obj, ["name"]: e.target.value})
                    }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label as="h5">Route Description</Form.Label>
                    <Form.Control 
                    as="textarea"
                    required type="text"
                    style={{ height: '100px' }}
                    placeholder="Enter Route Description..." 
                    value={obj.description}
                    onChange={(e)=>{setObj({...obj, ["description"]: e.target.value})}}                    />
                </Form.Group>
            </Form>
          </Container>

      </div>
  );
}

export default GeneralEditRouteForm;
