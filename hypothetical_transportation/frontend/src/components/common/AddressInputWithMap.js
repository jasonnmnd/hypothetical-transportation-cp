import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Col, Form, FormGroup, Row } from 'react-bootstrap';
import EditableTextField from './EditableTextField';
import MapComponent from '../maps/MapComponent';


function AddressInputWithMap( props ) {

    const [value, setValue] = useState(props.value);
    

    useEffect(()=>{
        setValue(props.value)
    },[props.value])

    const onChangeText = (e) => {
        setValue(e.target.value);
        props.onChange()
    }

    const getPinData = () => {
        return [
            {
                markerProps: {
                },
                pins: [
                    {
                        address: value
                    }
                ]
            },
        ]
    }
    
  
    return (
        <div >
            <EditableTextField key={props.key} keyType={props.keyType} value={value} underText={props.underText} onSubmit={props.onSubmit} onChange={onChangeText} onReset={() => {setValue(props.value)}}/>
            <MapComponent pinData={getPinData()} center={{address: value}} zoom={13}/>
        </div>
    );
}

AddressInputWithMap.propTypes = {
    key: PropTypes.string,
    value: PropTypes.string,
    underText: PropTypes.string,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
    keyType: PropTypes.string
}

const mapStateToProps = (state) => ({
});

AddressInputWithMap.defaultProps = {
    onChange: () => {}
}

export default connect(mapStateToProps)(AddressInputWithMap)