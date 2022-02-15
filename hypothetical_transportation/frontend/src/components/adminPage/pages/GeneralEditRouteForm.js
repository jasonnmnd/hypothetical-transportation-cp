import React from 'react';
import Header from '../../header/Header';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../NEWadminPage.css";

function GeneralEditRouteForm() {

    const emptyRoute = {
        id: 0,
        name: "",
        description: "",
        // school: param.school_id,
    }
    const [obj, setObj] = useState(emptyRoute);
    
  return (
      <div>
          <Header></Header>
          <Container className="container-main">
          <Alert variant="success">
            <Alert.Heading>Make a New Route</Alert.Heading>
            <p>
                To make a new route, first choose a school and plan a route for that school. You will be able to make 
                new routes, edit existing routes, modify stops for routes, and assign students within each route.
            </p>
            <hr />
            <Link to={`/admin/schools?pageNum=1`}>
                <Button variant='yellow'>
                    View Schools
                </Button>
            </Link>
            </Alert>
          </Container>

      </div>
  );
}

export default GeneralEditRouteForm;
