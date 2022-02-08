import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import image from "../../../public/schoolbusBackground.jpg";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from "../../actions/auth";
import isAdmin from "../../utils/user";

import { Button, Form, Col } from 'react-bootstrap';
import "./login.css";

function ForgotPasswordForm( props ) {
    const [details, setDetails] = useState({ email: ""});
  
    const submitHandler = (e) => {
      e.preventDefault();
      //backend send email to submitted value
      //if email is not associated with the user do something else?
    };
  
    
  
    return (
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

                <div className="d-flex justify-content-center align-items-center">
                    <Button className="login-buttons" type="submit" onClick={submitHandler}>
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
  }
  
  TESTLoginForm.propTypes = {
  }
  
  const mapStateToProps = (state) => ({
  });
  
  export default connect(mapStateToProps, {})(ForgotPasswordForm)