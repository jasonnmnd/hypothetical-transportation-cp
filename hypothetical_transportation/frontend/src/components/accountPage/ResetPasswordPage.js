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
import PlainHeader from "../header/PlainHeader";
import { Form, Button, Row, Col, Container, InputGroup, ButtonGroup, ToggleButton} from 'react-bootstrap';
import "../adminPage/NEWadminPage.css"

function ResetPasswordPage(props){
    const navigate = useNavigate();
    const [values, setValue] = useState({ old: "", new: "", confirm:"" });
    
    const saveNewPassword = () => {
        if (values.new === values.confirm) {
            
            const payload = {
                old_password: values.old,
                new_password: values.new
            }

            axios.put(`/api/auth/change-password`, payload, config(props.token))
            .then(res => {navigate(`/`)})
            .catch(err => {})
        } else {
            alert("Passwords do not match. Try again.")
        }
    }

    const resetHandler = (e) => {
        e.preventDefault();
        //console.log(values)
        saveNewPassword(values);
      };

      const message = "";


    return(
        <div>
            {
                isAdmin(props.user) ?  <Header></Header> : <PlainHeader></PlainHeader>
            }
            
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

                <Button onClick={resetHandler}>Confirm</Button>
            </Form>
        </div>
    );
}

ResetPasswordPage.propTypes = {
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
    token: state.auth.token
});

export default connect(mapStateToProps)(ResetPasswordPage)