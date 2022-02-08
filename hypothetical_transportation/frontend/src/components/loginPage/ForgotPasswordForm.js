import React, { useState } from "react";
import { Link } from "react-router-dom";
import image from "../../../public/schoolbusBackground.jpg";
import { connect } from 'react-redux';
import PlainHeader from "../header/PlainHeader";

import { Button, Form, Col, Row, Container} from 'react-bootstrap';
import "./login.css";

function ForgotPasswordForm( props ) {
    const [details, setDetails] = useState({ email: ""});
  
    const submitHandler = (e) => {
      e.preventDefault();
      console.log(details)
      //backend send email to submitted value
      //if email is not associated with the user do something else?
    };
  
    
  
    return (
        <>
        <PlainHeader></PlainHeader>
        <div className="color-overlay d-flex justify-content-center align-items-center" style ={{ 
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: "cover"
            }}>
            <Form className="rounded p-4 p-sm3">
                <h2>Please Enter the Email Address associated with your account:</h2>

                <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email"
                    placeholder="Enter Email" size="lg" 
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    value={details.email}/>
                </Form.Group>

                <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
                    <Row>
                        <Col>
                            <Button variant="yellow" type="submit" onClick={submitHandler}>
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