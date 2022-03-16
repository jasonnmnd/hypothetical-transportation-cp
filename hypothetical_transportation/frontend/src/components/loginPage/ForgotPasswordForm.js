import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from "../../../public/schoolbusBackground.jpg";
import { connect } from 'react-redux';
import PlainHeader from "../header/PlainHeader";
import { Button, Form, Col, Row, Container} from 'react-bootstrap';
import "./login.css";
import axios from "axios";

function ForgotPasswordForm( props ) {
    const navigate = useNavigate();
    const [details, setDetails] = useState({ email: ""});
    const [validated, setValidated] = useState(false);
  
    const handleSubmit = (event) => {

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            console.log(details);
        }

        setValidated(true);
        //backend send email to submitted value
        //if email is not associated with the user do something else?
        console.log(details);
        axios.post('/api/auth/password/reset', details)
          .then((res) => {
            navigate(`/`);
            alert('Password reset submitted. Check your email for more instructions!');
          })
          .catch((err) => {
            alert('Email address not found. Please try again.')
          });
    };
  
    
  
    return (
        <>
        <PlainHeader></PlainHeader>
        <div className="color-overlay d-flex justify-content-center align-items-center" style ={{ 
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: "cover"
            }}>
            <Form className="rounded p-4 p-sm3" noValidate validated={validated} onSubmit={handleSubmit}>
                <h2>Please enter the email address associated with your account:</h2>

                <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                    required
                    type="email"
                    placeholder="Enter Email" size="lg" 
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    value={details.email}/>
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    <Form.Control.Feedback type="invalid">Please enter an email.</Form.Control.Feedback>
                </Form.Group>

                <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
                    <Row>
                        <Col>
                            <Button variant="yellow" type="submit">
                                Submit
                            </Button>
                        </Col>
                        <Col>
                        <div className="d-flex justify-content-center align-items-center">
                            <Link to={`/`}> 
                                <Button variant="yellow">
                                    Back To Login
                                </Button>
                            </Link>                
                        </div>
                        </Col>
                    </Row>
                </Container>
            </Form>
        </div>
        </>
    );
  }
  
  ForgotPasswordForm.propTypes = {
  }
  
  const mapStateToProps = (state) => ({
  });
  
  export default connect(mapStateToProps, {})(ForgotPasswordForm)