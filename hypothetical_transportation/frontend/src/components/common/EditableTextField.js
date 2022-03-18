import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Col, Form, Container, Row } from 'react-bootstrap';
import '../adminPage/NEWadminPage.css';


function EditableTextField( props ) {

    const [value, setValue] = useState(props.value);
    const [editable, setEditable] = useState(false);
    

    useEffect(()=>{
        setValue(props.value)
    },[props.value])

    const onSubmit = (e) => {
        e.preventDefault();
        props.onSubmit({
            key: props.keyType,
            value: value
        });
        setEditable(false);
    }

    const getInput = () => {
        return (
            <Form className='editable-input'>
                <Row>
                    <Col className='input-field'>
                        <Form.Control type="text" placeholder="Enter email" onChange={(e) => {setValue(e.target.value); props.onChange(e);}} value={value} />
                        <Form.Text className="text-muted">
                            {props.underText}
                        </Form.Text>
                    </Col>
                        <Col className='input-col'>
                            <Button variant="yellowEditSmall" onClick={onSubmit}>Submit</Button>
                        </Col>
                        <Col className='input-col'>
                            <Button variant="yellowEditSmall" onClick={() => {setValue(props.value); setEditable(false); props.onReset()}}>Reset</Button>
                        </Col>
                </Row>
            </Form>
        )
    }
  
    return (
        <div >
            {editable ? getInput() : <span onClick={() => setEditable(true)}>✏️ {value}</span>}
        </div>
    );
}

EditableTextField.propTypes = {
    keyType: PropTypes.string,
    value: PropTypes.string,
    underText: PropTypes.string,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    onReset: PropTypes.func
}

EditableTextField.defaultProps = {
    onChange: () => {},
    onReset: () => {}
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(EditableTextField)