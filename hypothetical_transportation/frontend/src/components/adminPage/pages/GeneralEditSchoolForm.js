import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../NEWadminPage.css"
import Header from "../../header/Header";
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import { getSchool, updateSchool, addSchool } from "../../../actions/schools";
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { getItemCoord } from "../../../utils/geocode";

//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
//input4: string action determining new or edit
function GeneralEditSchoolForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const[coord,setCoord]=useState({lat:0, lng:0});

    
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [busArrivalTime, setBusArrivalTime] = useState({
        hour: "00",
        minute: "00"
    })

    const [busDepartureTime, setBusDepartureTime] = useState({
        hour: "00",
        minute: "00"
    })


    const fields = [
        "name",
        "address"
    ]

    const hours = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
    ]

    const minutes = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
    ]

    useEffect(() => {
        if(props.action == "edit"){
            props.getSchool(param.id);
            setName(props.curSchool.name);
            setAddress(props.curSchool.address);
            setCoord({lat: Number(props.curSchool.latitude), lng: Number(props.curSchool.longitude)})
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
                address: address,
                longitude: coord.lng.toFixed(6),
                latitude: coord.lat.toFixed(6),
            }, param.id);
            } else {
                props.addSchool({
                    name: name,
                    address: address,
                    longitude: coord.lng.toFixed(6),
                    latitude: coord.lat.toFixed(6),
                })
            }
            navigate(`/admin/schools`)
        }
    
        setValidated(true);
    }

    // const handleSelect = async value => {};


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
                    <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                        {props.action == "edit" ? <h1>Edit sssSchool</h1> : <h1>Create School</h1>}
                    </div>
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

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridTime">
                                <Form.Label as="h5">Bus Arrival Time</Form.Label>
                                    <div className="d-flex flex-row">
                                        <Form.Select size="sm" style={{width: "65px"}}>
                                            {
                                                hours.map((hour, i) => {
                                                    return <option value={hour} key={i}>{hour}</option>
                                                })
                                            }
                                        </Form.Select>
                                        <Form.Text> : </Form.Text>
                                        <Form.Select size="sm" style={{width: "65px"}}>
                                            {
                                                hours.map((hour, i) => {
                                                    return <option value={hour} key={i}>{hour}</option>
                                                })
                                            }
                                        </Form.Select>
                                    </div>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTime">
                            <Form.Label as="h5">Bus Departure Time</Form.Label>
                                <div className="d-flex flex-row">
                                    <Form.Select size="sm" style={{width: "65px"}}>
                                        {
                                            hours.map((hour, i) => {
                                                return <option value={hour} key={i}>{hour}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text> : </Form.Text>
                                    <Form.Select size="sm" style={{width: "65px"}}>
                                        {
                                            hours.map((hour, i) => {
                                                return <option value={hour} key={i}>{hour}</option>
                                            })
                                        }
                                    </Form.Select>
                                </div>
                            </Form.Group>

                        </Row>
                                                
                        <Form.Group className="mb-3" controlId="validationCustom02">
                            <Form.Label as="h5">Address</Form.Label>
                            <Form.Control 
                            required 
                            type="text"
                            placeholder="Enter Address..." 
                            value={address}
                            onChange={(e)=> {
                                setAddress(e.target.value)
                                getItemCoord(e.target.value,setCoord);
                            }}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a valid address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label as="h5">Location Assistance</Form.Label>
                            <AssistedLocationMap address={address} coord={coord} setAddress={setAddress} setCoord={setCoord}></AssistedLocationMap>
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

