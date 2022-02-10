import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../NEWadminPage.css"
import Header from "../../header/Header";
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import { getSchool, updateSchool, addSchool } from "../../../actions/schools";
import { Container, Form, Button } from 'react-bootstrap';

//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
//input4: string action determining new or edit
function GeneralEditSchoolForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);

    
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");


    const fields = [
        "name",
        "address"
    ]

    useEffect(() => {
        if(props.action == "edit"){
            props.getSchool(param.id);
            setName(props.curSchool.name);
            setAddress(props.curSchool.address);
        }
    }, []);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
        else {
            if(props.action == "edit"){
            props.updateSchool({
                name: name,
                address: address
            }, param.id);
            } else {
                props.addSchool({
                    name: name,
                    address: address
                })
            }
            navigate(`/admin/schools`)
        }
        

        setValidated(true);
    }


    // const confirmation = (e)=>{
    //     e.preventDefault();
    //     setOpenModal(true)
    // }

    // const handleConfirmAddress = () => {
    //     console.log("Address confirmed")
    //     submit()
    //   }
    
    return (
        <div> 
            <Header></Header>
                <Container className="container-main">
                    <Form className="shadow-lg p-3 mb-5 bg-white rounded" noValidate validated={validated} onSubmit={handleSubmit}>

                        <Form.Group className="mb-3" controlId="validationCustom01">
                            <Form.Label as="h5">Name of School</Form.Label>
                            <Form.Control 
                            required 
                            type="text"
                            placeholder="Enter Name..." 
                            value={name}
                            onChange={(e)=>{setName(e.target.value);}}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a valid name.</Form.Control.Feedback>
                        </Form.Group>
                                                
                        <Form.Group className="mb-3" controlId="validationCustom02">
                            <Form.Label as="h5">Address</Form.Label>
                            <Form.Control 
                            required 
                            type="text"
                            placeholder="Enter Address..." 
                            value={address}
                            onChange={(e)=> {setAddress(e.target.value)}}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a valid address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label as="h5">Location Assistance</Form.Label>
                            <AssistedLocationMap address={address} setAddress={setAddress}></AssistedLocationMap>
                        </Form.Group>

                        <Button variant="yellowsubmit" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>
        </div>
    )
}

GeneralEditSchoolForm.propTypes = {
    getSchool: PropTypes.func.isRequired,
    updateSchool: PropTypes.func.isRequired,
    addSchool: PropTypes.func.isRequired,
    action: PropTypes.string
}

const mapStateToProps = (state) => ({
    curSchool: state.schools.viewedSchool

});

export default connect(mapStateToProps, {getSchool, updateSchool, addSchool})(GeneralEditSchoolForm)

