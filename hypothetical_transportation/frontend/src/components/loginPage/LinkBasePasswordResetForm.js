import React, { useState } from "react";
import { Link } from "react-router-dom";
import image from "../../../public/schoolbusBackground.jpg";
import { connect } from 'react-redux';
import PlainHeader from "../header/PlainHeader";

import { Button, Form, Col, Row, Container} from 'react-bootstrap';
import "./login.css";

function LinkBasePasswordResetForm( props ) {
    const [values, setValue] = useState({ new: "", confirm:""});
    const [resetted, setResetted] = useState(false);
  
    const submitHandler = (e) => {
      e.preventDefault();
      console.log(values)
      //backend send email to submitted value
      //if email is not associated with the user do something else?
      if(values.new===""){
        console.log("You Cannot Have a blank password")
        alert("You Cannot Have a blank password")
      }
      else if (values.new === values.confirm) {
        console.log("now get backend to do something")
        setResetted(true)
        } else {
        console.log("Passwords do not match. Try again")
        alert("Passwords do not match. Try again.")
        }
    };
  
    
  
    return (
        <>
        <PlainHeader></PlainHeader>
        <div className="color-overlay d-flex justify-content-center align-items-center" style ={{ 
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: "cover"
            }}>
            {!resetted ?
            <Form className="rounded p-4 p-sm3">
                <h2>Reset Password for *INSERT EMAIL HERE? Something from the url lets us know what email?*</h2>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label as="h5">New Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Enter new password..." 
                    value={values.new}
                    onChange={(e) => setValue({ ...values, new: e.target.value })}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label as="h5">Confirm New Password</Form.Label>
                    <Form.Control
                    type="password"
                    placeholder="Confirm new password..." 
                    value={values.confirm}
                    onChange={(e) => setValue({ ...values, confirm: e.target.value })}/>
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
            </Form>:
            <>
                <Form className="rounded p-4 p-sm3">
                    <h2>Your Password Reset Request has been sent</h2>
                    <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
                        <Row>
                            <Col>
                            <div className="d-flex justify-content-center align-items-center">
                                <Link to={`/`}> 
                                    <Button variant="yellow">
                                        To Login Page
                                    </Button>
                                </Link>                
                            </div>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </>}
        </div>
        </>
    );
  }
  
  LinkBasePasswordResetForm.propTypes = {
  }
  
  const mapStateToProps = (state) => ({
  });
  
  export default connect(mapStateToProps, {})(LinkBasePasswordResetForm)