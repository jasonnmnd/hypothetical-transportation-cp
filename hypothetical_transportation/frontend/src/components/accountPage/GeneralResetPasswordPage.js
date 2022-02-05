import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import SidebarSliding from "../adminPage/components/sidebar/SidebarSliding";
import Header from "../header/Header";
import PlainHeader from "../header/PlainHeader";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isAdmin from "../../utils/user";
import config from "../../utils/config";
import axios from "axios";
import { resetPassword, resetResetPassword } from '../../actions/auth'
import "../adminPage/NEWadminPage.css"
import { Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton} from 'react-bootstrap';

function GeneralResetPasswordPage(props){
    const navigate = useNavigate();
    const [values, setValue] = useState({ old: "", new: "", confirm:"" });
    
    const saveNewPassword = () => {
        if (values.new === values.confirm) {
            props.resetPassword(values.old, values.new);
            

        } else {
            alert("Passwords do not match. Try again.")
        }
    }

    const resetHandler = (e) => {
        e.preventDefault();
        saveNewPassword();
      };

    const message = "";

    if(props.successfulPasswordReset){
        props.resetResetPassword();
        navigate(`/`);
    }

    return(
        <div>
            {
                isAdmin(props.user) ?  <Header></Header> : <PlainHeader></PlainHeader>
            }
            <Container className="container-main">
                <Form className="shadow-lg p-3 mb-5 bg-white rounded">
                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label as="h5">Old Password</Form.Label>
                        <Form.Control
                        type="password"
                        placeholder="Enter old password..." 
                        value={values.old}
                        onChange={(e) => setValue({ ...values, old: e.target.value })}/>
                    </Form.Group>

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

                    <Button variant="yellowsubmit" type="submit" onClick={resetHandler}>Confirm</Button>
                </Form>
            </Container>
        </div>
    );
}

GeneralResetPasswordPage.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        full_name: PropTypes.string,
        address: PropTypes.string,
        groups: PropTypes.arrayOf(PropTypes.number)

    })
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    successfulPasswordReset: state.auth.successfulPasswordReset
});

export default connect(mapStateToProps, { resetPassword, resetResetPassword })(GeneralResetPasswordPage)