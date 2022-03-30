import React, {useEffect} from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../actions/auth";
import { getStudentInfo, getInRangeStop } from '../../actions/students';
import ParentHeader from '../header/ParentHeader';
import { Row, Card, Container, Col, Alert } from 'react-bootstrap';
import IconLegend from '../common/IconLegend';
import MapComponent from '../maps/MapComponent';
import GeneralAdminTableView from '../adminPage/components/views/GeneralAdminTableView';


function StudentPage(props) {


  const navigate = useNavigate();
  const param = useParams();
  const student = props.student;
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    props.getStudentInfo(param.student_id);
  }, []);



    const doNothing = ()=>{

    }

    useEffect(() => {
        if(searchParams.get(`pageNum`) != null){
            let paramsToSend = Object.fromEntries([...searchParams]);
            paramsToSend.student = param.student_id;
            props.getInRangeStop(param.student_id, paramsToSend);
        }
        else{
            setSearchParams({
            [`pageNum`]: 1,
            })
        }
        }, [searchParams]);

  return (
    <div>
        <ParentHeader></ParentHeader>

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
                        {student.school.name}
                    </Card.Body>
                </Card>

                <br></br>

                <Card as={Col} style={{padding: "0px"}}>
                    <Card.Header as="h5">Route</Card.Header>
                    <Card.Body>
                        <Container className='d-flex flex-column' style={{gap: "20px"}}>
                        {(student.routes!==undefined && student.routes!==null) ?
                            <>
                                <div><strong>Name: </strong>{student.routes.name}</div>
                                <div><strong>Description: </strong>{student.routes.description}</div>
                            </>
                            :
                            <Alert variant="danger">
                                <Alert.Heading>You have no route</Alert.Heading>
                                <p>
                                Please wait for school staff to assign you a bus route.
                                </p>
                            </Alert>
                        }
                        </Container>
                    </Card.Body>
                </Card>
            </Row>

            {/* <Card>
                <Card.Header as="h5">Map View of Stops</Card.Header>
                {(student.routes !==undefined && student.routes!==null) ?
                <Container className='d-flex flex-column justify-content-center' style={{marginTop: "20px"}}>
                    <IconLegend legendType='parentStudent'></IconLegend>
                    <Card.Body>
                        <MapComponent pinData={pinData} otherMapComponents={extraComponents} center={{lng: Number(props.student.guardian.longitude),lat: Number(props.student.guardian.latitude)}}></MapComponent>
                    </Card.Body>    
                </Container>
                :
                <Card.Body>
                    No stops to show right now. Please wait for an administrator to add stops.
                </Card.Body>
                }
            </Card> */}


            <Card>
                <Card.Header as="h5">In Range Stops</Card.Header>
                <Card.Body>
                    <GeneralAdminTableView title='In Range Stops' tableType='stop' search="stop" values={props.stops} action={doNothing} totalCount={props.stopCount}/>
                </Card.Body>
            </Card>
        </Container>
    </div>
  )
}

StudentPage.propTypes = {

}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    token: state.auth.token,
    student: state.students.viewedStudent,
    stops: state.students.inRangeStops.results,
    stopCount: state.students.inRangeStops.count,
});


export default connect(mapStateToProps, {logout, getStudentInfo, getInRangeStop} )(StudentPage)