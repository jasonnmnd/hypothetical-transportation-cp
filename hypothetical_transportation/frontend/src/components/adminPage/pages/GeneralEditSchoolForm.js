import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../NEWadminPage.css"
import Header from "../../header/AdminHeader";
import AssistedLocationMap from "../../maps/AssistedLocationMap";
import { getSchool, updateSchool, addSchool } from "../../../actions/schools";
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { getItemCoord } from "../../../utils/geocode";
import getType from "../../../utils/user2";
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
//input4: string action determining new or edit
function GeneralEditSchoolForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const[coord,setCoord] = useState({lat:36.0016944, lng:-78.9480547});

    
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [busArrivalTime, setBusArrivalTime] = useState({
        hour: "00",
        minute: "00",
        time: "AM"
    })

    const [busDepartureTime, setBusDepartureTime] = useState({
        hour: "00",
        minute: "00",
        time: "PM"
    })


    const fields = [
        "name",
        "address"
    ]

    const hours = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"
    ]

    const minutes = [
        "00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25",
        "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51",
        "52", "53", "54", "55", "56", "57", "58", "59"
    ]

    const convertTo24Hr = (hour) => {
        hour = parseInt(hour);
        hour += 12;
        return String(hour)
    }

    const convertTo12Hr = (hour, isArrival) => {
        hour = parseInt(hour)
        if (hour > 12) {

            if (isArrival) {
                setBusArrivalTime({time: "PM"});
            } else {
                setBusDepartureTime({time: "PM"});
            }

            hour -= 12;
            return String(hour)
        } else {
            if (isArrival) {
                setBusArrivalTime({time: "AM"});
            } else {
                setBusDepartureTime({time: "AM"});
            }
        }
    }

    useEffect(() => {
        if(props.action == "edit"){
            props.getSchool(param.id);
            setName(props.curSchool.name);
            setAddress(props.curSchool.address);
            setCoord({lat: Number(props.curSchool.latitude), lng: Number(props.curSchool.longitude)})
            setBusArrivalTime({hour: props.curSchool.bus_arrival_time.substring(0, 2), minute: props.curSchool.bus_arrival_time.substring(3, 5)});
            setBusDepartureTime({hour: props.curSchool.bus_departure_time.substring(0, 2), minute: props.curSchool.bus_departure_time.substring(3, 5)});
        }
    }, []);

    useEffect(()=>{
        if(props.action !== "edit"){
            setName("")
            setAddress("")
            setCoord({lat: 36.0016944, lng: -78.9480547})
            setBusArrivalTime({hour:"00", minute:"00"})
            setBusDepartureTime({hour:"00", minute:"00"})
        }
        else{
            props.getSchool(param.id);
        }
    },[props.action])

    useEffect(()=>{
        if(props.action == "edit"){
            setName(props.curSchool.name);
            setAddress(props.curSchool.address);
            setCoord({lat: Number(props.curSchool.latitude), lng: Number(props.curSchool.longitude)})
            setBusArrivalTime({hour: props.curSchool.bus_arrival_time.substring(0, 2), minute: props.curSchool.bus_arrival_time.substring(3, 5)});
            setBusDepartureTime({hour: props.curSchool.bus_departure_time.substring(0, 2), minute: props.curSchool.bus_departure_time.substring(3, 5)});
        }

    },[props.curSchool])

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
        else {

            // if (busArrivalTime.time == "PM") {
            //     busArrivalTime.hour = convertTo24Hr(busArrivalTime.hour);
            // }

            // if (busDepartureTime.time == "PM") {
            //     busDepartureTime.hour = convertTo24Hr(busDepartureTime.hour);
            // }

            if(props.action == "edit"){
                props.updateSchool({
                    name: name,
                    address: address,
                    longitude: coord.lng.toFixed(6),
                    latitude: coord.lat.toFixed(6),
                    bus_arrival_time: busArrivalTime.hour + ":" + busArrivalTime.minute + ":00",
                    bus_departure_time: busDepartureTime.hour + ":" + busDepartureTime.minute + ":00"
                }, param.id);
                console.log(busArrivalTime);
                console.log(busDepartureTime);
            } else {
                props.addSchool({
                    name: name,
                    address: address,
                    longitude: coord.lng.toFixed(6),
                    latitude: coord.lat.toFixed(6),
                    bus_arrival_time: busArrivalTime.hour + ":" + busArrivalTime.minute + ":00",
                    bus_departure_time: busDepartureTime.hour + ":" + busDepartureTime.minute + ":00"
                })
                console.log(busArrivalTime);
                console.log(busDepartureTime);
            }
            navigate(`/${getType(props.user)}/schools`)
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
            {(props.action == "edit" && getType(props.user) == "staff" ) || getType(props.user) == "admin" ?
                <Container className="container-main">
                    <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                        {props.action == "edit" ? <h1>Edit School</h1> : <h1>Create School</h1>}
                    </div>
                    <Form className="shadow-lg p-3 mb-5 bg-white rounded" noValidate validated={validated} onSubmit={handleSubmit}
                    onKeyPress={event => {
                        if (event.key === 'Enter' /* Enter */) {
                          event.preventDefault();
                        }
                      }}
                    >

                        <Form.Group className="mb-3" controlId="validationCustom01">
                            <Form.Label as="h5">Name of School</Form.Label>
                            <Form.Control 
                            required 
                            type="text"
                            placeholder="Enter Name..." 
                            value={name}
                            onChange={(e)=>{setName(e.target.value);}}
                            disabled={getType(props.user)=="staff" ? true : false}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a valid name.</Form.Control.Feedback>
                        </Form.Group>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridTime">
                                <Form.Label as="h5">Bus Arrival Time</Form.Label>
                                    <div className="d-flex flex-row">
                                        <Form.Select size="sm" style={{width: "65px"}} value={busArrivalTime.hour} onChange={(e) => setBusArrivalTime({...busArrivalTime, hour: e.target.value})}>
                                            {
                                                hours.map((hour, i) => {
                                                    return <option value={hour} key={i}>{hour}</option>
                                                })
                                            }
                                        </Form.Select>
                                        <Form.Text> : </Form.Text>
                                        <Form.Select size="sm" style={{width: "65px"}} value={busArrivalTime.minute} onChange={(e) => setBusArrivalTime({...busArrivalTime, minute: e.target.value})}>
                                            {
                                                minutes.map((minute, i) => {
                                                    return <option value={minute} key={i}>{minute}</option>
                                                })
                                            }
                                        </Form.Select>
                                    </div>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridTime">
                            <Form.Label as="h5">Bus Departure Time</Form.Label>
                                <div className="d-flex flex-row">
                                    <Form.Select size="sm" style={{width: "65px"}} value={busDepartureTime.hour} onChange={(e) => setBusDepartureTime({...busDepartureTime, hour: e.target.value})}>
                                        {
                                            hours.map((hour, i) => {
                                                return <option value={hour} key={i}>{hour}</option>
                                            })
                                        }
                                    </Form.Select>
                                    <Form.Text> : </Form.Text>
                                    <Form.Select size="sm" style={{width: "65px"}} value={busDepartureTime.minute} onChange={(e) => setBusDepartureTime({...busDepartureTime, minute: e.target.value})}>
                                        {
                                            minutes.map((minute, i) => {
                                                return <option value={minute} key={i}>{minute}</option>
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
                            disabled={getType(props.user)=="staff" ? true : false}
                            />
                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">Please provide a valid address.</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label as="h5">Location Assistance</Form.Label>
                            <AssistedLocationMap draggable={getType(props.user)=="staff" ? false:true} address={address} coord={coord} setAddress={setAddress} setCoord={setCoord}></AssistedLocationMap>
                        </Form.Group>

                        <Button variant="yellowsubmit" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Container>:getType(props.user) == "staff" ? 
                <Container className="container-main">
                <Alert variant="danger">
                  <Alert.Heading>Access Denied</Alert.Heading>
                  <p>
                    As School staff, you do not access to creating new schools. If you believe this is an error, contact an administrator.          
                  </p>
                  </Alert>
                </Container>:
                <Container className="container-main">
                <Alert variant="danger">
                  <Alert.Heading>Access Denied</Alert.Heading>
                  <p>
                    You do not have access to this page. If you believe this is an error, contact an administrator.          
                    </p>
                  </Alert>
                </Container>}
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
    user: state.auth.user,
    curSchool: state.schools.viewedSchool

});

export default connect(mapStateToProps, {getSchool, updateSchool, addSchool})(GeneralEditSchoolForm)

