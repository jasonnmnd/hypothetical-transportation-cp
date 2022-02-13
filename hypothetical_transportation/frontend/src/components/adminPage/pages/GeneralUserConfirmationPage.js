import React, {useState} from 'react';
import PlainHeader from '../../header/PlainHeader';
import { Container, Form, Button } from 'react-bootstrap';
import "../NEWadminPage.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from "react-router-dom";



function GeneralUserConfirmationPage() {

  const [values, setValue] = useState({ new: "", confirm:"" });
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if (values.new === values.confirm) {
            
        const payload = {
            new_password: values.new
        }
        //Make backend call

      } else {
          alert("Passwords do not match. Try again.")
      }
    }

    setValidated(true);
  }

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

}

const mapStateToProps = (state) => ({

});


export default connect(mapStateToProps)(GeneralUserConfirmationPage);
