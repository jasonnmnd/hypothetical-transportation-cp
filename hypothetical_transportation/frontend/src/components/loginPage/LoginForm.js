import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import image from "../../../public/schoolbusBackground.jpg";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from "../../actions/auth";
import isAdmin from "../../utils/user";
import PlainHeader from "../header/PlainHeader";
import { Button, Form, Col } from 'react-bootstrap';
import "./login.css";
import getType from "../../utils/user2";

function LoginForm( props ) {
    const [details, setDetails] = useState({ email: "", password: "" });
  
    const submitHandler = (e) => {
      e.preventDefault();
      props.login(details.email, details.password);
    };
  
    if (props.isAuthenticated) {
      console.log(props.user);
      if (getType(props.user) == "student") { //We need the id of the student for the url
        const link = "/"+getType(props.user)+"/"+props.user.id
        return <Navigate to={link} />;
      }
      const link = "/"+getType(props.user)
      return <Navigate to={link} />;
    }
    
  
    return (
        <>
        <PlainHeader></PlainHeader>
        <div className="color-overlay d-flex justify-content-center align-items-center" style ={{ 
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: "cover"
            }}>
            <Form className="rounded p-4 p-sm3" onSubmit={submitHandler}>
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
                    <Button variant="login" type="submit">
                        Submit
                    </Button>
                </div>
                <Link to={`/forgot_password`} className="d-flex justify-content-center align-items-center"> 
                    Forgot Password? Click here.
                </Link>
            </Form>
        </div>
        </>
    );
  }
  
  LoginForm.propTypes = {
      isAuthenticated: PropTypes.bool,
      login: PropTypes.func.isRequired
  }
  
  const mapStateToProps = (state) => ({
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user
  });
  
  export default connect(mapStateToProps, { login })(LoginForm)