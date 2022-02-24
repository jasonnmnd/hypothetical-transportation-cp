import React, {useEffect, useState} from 'react';
import PlainHeader from '../../header/PlainHeader';
import { Container, Form, Button } from 'react-bootstrap';
import "../NEWadminPage.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { logout } from '../../../actions/auth'

function GeneralUserConfirmationPage(props) {
  const param = useParams();
  const [values, setValue] = useState({ new: "", confirm:"" });
  const [validated, setValidated] = useState(false);
  const nagivate = useNavigate();
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (values.new === values.confirm) {    
        const payload = {
            code: param.code,
            password: values.new
        }

        //Make backend call
        if (props.action == "new") {
        axios.post('/api/auth/invite/verified', payload)
          .then((res) => {
            nagivate(`/`);
          })
          .catch((err) => {
            console.log(err)
          });
          } else if (props.action=="reset") {
            axios.post('/api/auth/password/reset/verified', payload)
            .then((res) => {
              nagivate(`/`);
            })
            .catch((err) => {
              console.log(err)
            });
        }
        

      } else {
          alert("Passwords do not match. Try again.")
      }
    }

    setValidated(true);
  }

  useEffect(() => {
    props.logout();
  }, []);

  return (
    <>
      <PlainHeader></PlainHeader>
      <Container className="container-main">
        <Form className="shadow-lg p-3 mb-5 bg-white rounded" noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="validationCustom01">
              <Form.Label as="h5">New Password</Form.Label>
              <Form.Control
              required
              type="password"
              placeholder="Enter new password..." 
              value={values.new}
              onChange={(e) => setValue({ ...values, new: e.target.value })}/>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please provide a valid password.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="validationCustom02">
              <Form.Label as="h5">Confirm New Password</Form.Label>
              <Form.Control
              required
              type="password"
              placeholder="Confirm new password..." 
              value={values.confirm}
              onChange={(e) => setValue({ ...values, confirm: e.target.value })}/>
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">Please provide a valid confirmation password.</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit">Confirm</Button>
      </Form>
      </Container>
    </>
  );
}

GeneralUserConfirmationPage.propTypes = {
  action: PropTypes.string
}

const mapStateToProps = (state) => ({

});


export default connect(mapStateToProps, {logout})(GeneralUserConfirmationPage);
