import React from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../header/AdminHeader'
import "../NEWadminPage.css";

function GeneralNewRoutePage() {
    
  return (
      <div>
          <Header></Header>
          <Container className="container-main">
          <Alert variant="success">
            <Alert.Heading>Make a New Route</Alert.Heading>
            <p>
                To make a new route, first choose a school and plan a route for that school. You will be able to make 
                new routes, edit existing routes, and assign students within each route to a stop.
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

export default GeneralNewRoutePage;
