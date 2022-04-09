import React, { useEffect, useState } from "react";
import ParentHeader from "../../header/ParentHeader";
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from "axios";
import config from "../../../utils/config";
import { getStudentInfo,getInRangeStop } from '../../../actions/students';
import { Container, Card, Button, Row, Col, Form } from 'react-bootstrap';
import GeneralAdminTableView from "../../adminPage/components/views/GeneralAdminTableView";
import isAdmin from "../../../utils/user";
import Header from "../../header/AdminHeader";
import MapComponent from "../../maps/MapComponent";
import { InfoWindow } from "@react-google-maps/api";
import IconLegend from "../../common/IconLegend";
import isBusDriver from "../../../utils/userBusDriver";
import isSchoolStaff from "../../../utils/userSchoolStaff";
import { getRunByRoute } from "../../../actions/drive";
import { runCallEveryPeriod } from "../../../utils/live_updating";
import StudentViewMap from "../../maps/StudentViewMap";

function ParentStudentDetails(props){
    const param = useParams();
    const student = props.student;
    let [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        props.getStudentInfo(param.id);
        // props.getInRangeStop(param.id);
    }, []);

    const doNothing = ()=>{

    }



    useEffect(()=>{
        if(props.student.routes) {
            return runCallEveryPeriod(() => {
                props.getInRangeStop(student.id);
                props.getRunByRoute(student.routes.id);
            })
        } 
    },[props.student])

  useEffect(() => {
    if(searchParams.get(`pageNum`) != null){
      let paramsToSend = Object.fromEntries([...searchParams]);
      paramsToSend.student = param.id;
      props.getInRangeStop(param.id, paramsToSend);
    }
    else{
      setSearchParams({
        [`pageNum`]: 1,
      })
    }
  }, [searchParams]);








    return(
        // <>
        // <Header textToDisplay={"Student Details"} shouldShowOptions={true}></Header>
        //     <div className='header-padding'>
        //     <div className='left-content'>
        //         <div className='info-fields'>
        //             <h2>Name:</h2>
        //             <h3>{student.full_name}</h3>
        //         </div>
        //         <div className='info-fields'>
        //             <h2>ID:</h2>
        //             <h3>{student.student_id}</h3>
        //         </div>
        //         <div className='info-fields'>
        //             <h2>School:</h2>
        //             <h3>{student.school.name}</h3>
        //         </div>
        //         <div className='info-fields'>
        //             <h2>Route:</h2>
        //             <h3>{(student.routes !==undefined && student.routes!==null) ? student.routes.name : "NONE"}</h3>
        //         </div>

        //         <div className='edit-delete-buttons'>
        //             <Link to="/parent">
        //                 <button>Go Back</button>
        //             </Link>
        //         </div>
        //     </div>
        //     </div>
        // </>

        <div>  
        {
            isAdmin(props.user) || isBusDriver(props.user) || isSchoolStaff(props.user) ? <Header></Header> : <ParentHeader></ParentHeader>
        }        
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        

        <Row  style={{gap: "10px"}}>
            <Card as={Col} style={{padding: "0px"}}>
                <Card.Header as="h5">Name</Card.Header>
                <Card.Body>
                    <Card.Text>{student.full_name}</Card.Text>
                </Card.Body>
            </Card>

            <br></br>
            <Card as={Col} style={{padding: "0px"}}>
                <Card.Header as="h5">StudentID </Card.Header>
                <Card.Body>
                    <Card.Text>{student.student_id}</Card.Text>
                </Card.Body>
            </Card>
        </Row>

        <Row style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
            <Card.Header as="h5">School </Card.Header>
            <Card.Body>
                <Card.Text>{student.school.name}</Card.Text>
            </Card.Body>
        </Card>

        <Card as={Col} style={{padding: "0px"}}>
            <Card.Header as="h5">Route</Card.Header>
            <Card.Body>
                <Card.Text>{(student.routes !==undefined && student.routes!==null) ? student.routes.name : "Your child has no route"}</Card.Text>
                <Form.Group className="mb-3" controlId="formGridDescription">
                    <Form.Control 
                    type="text"
                    as="textarea"
                    value={(student.routes !==undefined && student.routes!==null) ? student.routes.description : "NONE"}
                    style={{height: '200px',pointerEvents: "none"}}
                    readOnly
                  />
              </Form.Group>
            </Card.Body>
        </Card>
        </Row>

        {student.email != null ?
            <Row  style={{gap: "10px"}}>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Student Email</Card.Header>
                    <Card.Body>
                        <Card.Text>{student.email}</Card.Text>
                    </Card.Body>
                </Card>

                <br></br>
                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Student Phone Number </Card.Header>
                    <Card.Body>
                        <Card.Text>{student.phone_number=="" || student.phone_number==null? "No Phone Record Found":student.phone_number}</Card.Text>
                    </Card.Body>
                </Card>
            </Row>
            :
            <></>
            }


        {props.activeRun!==undefined && props.activeRun!==null && props.activeRun.end_time !==undefined &&  props.activeRun.end_time ==null ?
        <Row style={{gap: "10px"}}>
        <Card border={"success"} as={Col} style={{padding: "0px", backgroundColor: "#d9ffe0"}}>
            <Card.Header as="h5">Active Run Info </Card.Header>
            <Card.Body>
                <p><strong>Bus Driver:</strong> {props.activeRun.driver!==null && props.activeRun.driver !== undefined ? props.activeRun.driver.full_name : ""}</p>
                <p><strong>Bus Number:</strong> {props.activeRun.bus_number!==null && props.activeRun.bus_number!==undefined ?props.activeRun.bus_number : ""}</p>
            </Card.Body>
        </Card></Row> : <></>}


        <Row style={{gap: "10px"}}>
            <Card as={Col} style={{padding: "0px"}}>
            <Card.Header as="h5">Map View of Stops</Card.Header>
            {(student.routes !==undefined && student.routes!==null) ?
            <Container className='d-flex flex-column justify-content-center' style={{marginTop: "20px"}}>
                <IconLegend legendType='parentStudent'></IconLegend>
                <Card.Body style={{padding: "0px",marginTop: "20px",marginBottom: "20px"}}>
                    {/* <MapComponent pinData={pinData} otherMapComponents={extraComponents} center={{lng: Number(props.student.guardian.longitude),lat: Number(props.student.guardian.latitude)}}></MapComponent> */}
                    <StudentViewMap student={props.student} activeRun={props.activeRun} stops={props.stops} />
                </Card.Body>    
            </Container>
            :
            <Card.Body>
                Your child has no route currently
            </Card.Body>
            }
        </Card>
        </Row>

        <Row style={{gap: "10px"}}>
        <Card as={Col} style={{padding: "0px"}}>
                <Card.Header as="h5">In Range Stops</Card.Header>
                <Card.Body>
                    <GeneralAdminTableView title='In Range Stops' tableType='stop' search="stop" values={props.stops} action={doNothing} totalCount={props.stopCount}/>
                </Card.Body>
            </Card>
        </Row>

        </Container>
    </div>

    )
}

ParentStudentDetails.propTypes = {
    getStudentInfo: PropTypes.func.isRequired,
    getInRangeStop: PropTypes.func.isRequired,
    getRunByRoute: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    student: state.students.viewedStudent,
    stops: state.students.inRangeStops.results,
    stopCount: state.students.inRangeStops.count,
    activeRun: state.drive.currentRun,
});

export default connect(mapStateToProps, {getStudentInfo,getInRangeStop, getRunByRoute})(ParentStudentDetails)