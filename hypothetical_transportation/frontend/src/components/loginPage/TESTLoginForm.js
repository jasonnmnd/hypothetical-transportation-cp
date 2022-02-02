import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import image from "../../../public/schoolbusBackground.jpg";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from "../../actions/auth";
import isAdmin from "../../utils/user";

import { Button, Form, Col } from 'react-bootstrap';
import "./TESTlogin.css";

function TESTLoginForm( props ) {
    const [details, setDetails] = useState({ email: "", password: "" });
  
    const submitHandler = (e) => {
      e.preventDefault();
      props.login(details.email, details.password);
    };
  
    if (props.isAuthenticated) {
      if(isAdmin(props.user)){
        return <Navigate to="/admin" />;
      }
      return <Navigate to="/parent" />;
    }
    
  
    return (
        <div className="color-overlay d-flex justify-content-center align-items-center" style ={{ 
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: "cover"
            }}>
            <Form className="rounded p-4 p-sm3">
                <h2>Enter Your Login Credentials:</h2>

                <Form.Group as={Col} className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email"
                    placeholder="Enter Email" size="lg" 
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    value={details.email}/>
                </Form.Group>

                <Form.Group as={Col} className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" 
                    placeholder="Password" size="lg"
                    onChange={(e) =>
                        setDetails({ ...details, password: e.target.value })
                      }/>
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
      isAuthenticated: PropTypes.bool,
      login: PropTypes.func.isRequired
  }
  
  const mapStateToProps = (state) => ({
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user
  });
  
  export default connect(mapStateToProps, { login })(TESTLoginForm)