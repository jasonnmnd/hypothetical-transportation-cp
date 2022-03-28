import React, { useEffect, useState } from 'react';
import Header from '../../header/AdminHeader';
import "../NEWadminPage.css";
import { Container, Form, Button, ButtonGroup, ToggleButton,Collapse, Card, Row, Alert } from 'react-bootstrap'; 
import { connect } from 'react-redux';
import { getSchools } from '../../../actions/schools';
import { getRoutes } from '../../../actions/routes';
import PropTypes from 'prop-types';
import { filterObjectForKeySubstring } from '../../../utils/utils';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../../utils/config';
import Select from 'react-select';
import getType from '../../../utils/user2';



function GeneralAdminEmailPage(props) {
    const nagivate = useNavigate();
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [currSchool, setCurrSchool] = useState("");
    const [currRoute, setCurrRoute] = useState("");
    const [emailSelection, setEmailSelection] = useState(1);
    const [thisIsRouteAnnouncement, setThisIsRouteAnnouncement] = React.useState(false);

    const ROUTE_PREFIX = "rou";
    let [searchParams, setSearchParams] = useSearchParams();
    const allSearchParams = Object.fromEntries([...searchParams]);
    let routeSearchParams = filterObjectForKeySubstring(allSearchParams, ROUTE_PREFIX);

    const handleThisIsRouteAnnouncement = () => {
        setThisIsRouteAnnouncement(!thisIsRouteAnnouncement);
      };

    const param = useParams();

    const handleEmailSelection = (e) => {
        setEmailSelection(e.target.value);
        if (e.target.value == 1) {
            setCurrSchool("");
            setCurrRoute("");
        } 
        else if (e.target.value == 2) {
            setCurrRoute("");
        }
    }

    const setSchool = (e) => {
        setCurrSchool(e.target.value);
        routeSearchParams.school = e.target.value
        routeSearchParams.ordering = "name"
        props.getRoutes(routeSearchParams);
    }
    
    const setRoute = (e) => {
        setCurrRoute(e.target.value);
    }

    const getIdType = (buttonVal) => {
        if (buttonVal == 1) {
            return "ALL"
        } else if (buttonVal == 2) {
            return "SCHOOL"
        } else if (buttonVal == 3) {
            return "ROUTE"
        }
    }

    const submit = (e) => {
        e.preventDefault();
        // if(!props.schoollist.some(v => ((''+v.id) === currSchool))){
        //     alert("Something is wrong with the school you entered. The selection has been cleared; please select from the dropdown list instead.")
        //     setCurrSchool("")
        //     setCurrRoute("")
        // }
        // if(!props.routes.some(v => ((''+v.id) === currRoute))){
        //     alert("Something is wrong with the route you entered. The selection has been cleared; please select from the dropdown list instead.")
        //     setCurrSchool("")
        //     setCurrRoute("")
        // }

        //Make bakend call here
        // console.log("Submit button pressed with school " + currSchool + " and route " + currRoute);
        
        //Make sure school actually selected
        if (getIdType(emailSelection) == "SCHOOL") {
            if (currSchool == "") {
                alert("Select a school from the dropdown.")
                return
            }
        }
        //Make sure route actually selected
        if (getIdType(emailSelection) == "ROUTE") {
            if (currSchool == "") {
                alert("Select a school from the dropdown.")
                return
            }
            if (currRoute == "") {
                alert("Select a route from the dropdown.")
                return
            }
        }

        const payload = {
            object_id: getIdType(emailSelection) == "SCHOOL" ? parseInt(currSchool) : parseInt(currRoute),
            id_type: getIdType(emailSelection),
            subject: subject,
            body: body
        }

        //Backend requires object_id to be set to a number, or removed
        if (getIdType(emailSelection) == "ALL") {
            delete payload['object_id'];
        }

        console.log(payload);


        if(thisIsRouteAnnouncement!==true){
            // console.log("not route announcement")
            axios.post('/api/communication/send-announcement', payload, config(props.token))
            .then((res) => {
                nagivate(`/admin`);
                alert('Email Successfully Sent!');
            })
            .catch((err) => {
                alert('Email was not sent. Please try again.')
            });
        }
        else{
            axios.post('/api/communication/send-route-announcement', payload, config(props.token))
            .then((res) => {
                nagivate(`/admin`);
                alert('Email Successfully Sent!');
            })
            .catch((err) => {
                alert('Email was not sent. Please try again.')
            });
        }
    }

    const emailTypes = [
        {name: "All Parents", value: 1},
        {name: "School", value: 2},
        {name: "Route", value: 3},
    ]

    useEffect(() => {
        props.getSchools({ordering:"name"});
        if(param.school_id!==null && param.school_id!==undefined){
            setCurrSchool(param.school_id);
            routeSearchParams.school = param.school_id;
            props.getRoutes(routeSearchParams);
            setEmailSelection(2);
        }
        if(param.route_id!==null && param.route_id!==undefined){
            setCurrRoute(param.route_id);
            setEmailSelection(3);
        }
    }, []);


    useEffect(() => {
        props.getSchools({ordering:"name"});
        if(param.school_id!==null && param.school_id!==undefined){
            setCurrSchool(param.school_id);
            routeSearchParams.school = param.school_id;
            props.getRoutes(routeSearchParams);
            setEmailSelection(2);
            if(param.route_id!==null && param.route_id!==undefined){
                setCurrRoute(param.route_id);
                setEmailSelection(3);
            }
        }else{
            setCurrSchool("");
            setCurrRoute("");
            setEmailSelection(1);
        }
    }, [param]);

    const [schoolSelected, setSchoolSelected] = useState({value:null, label: "------Select School------"})

    const [routeSelected, setRouteSelected] = useState({value: null, label: "------Select Route------"})

    const changeSchool = (e)=>{
        setSchoolSelected(e)
        setCurrSchool(e.value)
      }
    const changeRoute = (e)=>{
        setRouteSelected(e)
        setCurrRoute(e.value)
      }


  const getSchoolOPtion = ()=>{
    var opt = [{value: null, label: "------Select School------"}]
    if(props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0){
        const x = props.schoollist.map((item)=> {
            if(item.id==currSchool && schoolSelected.value!==item.id){
                setSchoolSelected({value:item.id, label:item.name})
            }
            return ({value:item.id, label:item.name})
        })    
        opt = [...opt, ...x]
    }
    // console.log(opt)
    return opt
}


const getRouteOption = ()=>{
    var opt = [{value: null, label: "------Select Route------"}]
    if(props.routes!==null && props.routes!==undefined && props.routes.length!==0){
        const x = props.routes.map((item)=> {
            if(item.id==currRoute && routeSelected.value!==item.id){
                setRouteSelected({value:item.id, label:item.name})
            }
            return ({value:item.id, label:item.name})
        })    
        opt = [...opt, ...x]
    }
    else{
        opt = [{value: null, label: "---There is no route for this school!---"}]
    }
    // console.log(opt)
    return opt
}


    
  return (
    <>
        <Header></Header>

        {getType(props.user) == "staff" || getType(props.user) == "admin" ?
        <Container className="container-main">
            <div className="shadow-sm p-3 mb-5 bg-white rounded d-flex flex-row justify-content-center">
                <h1>Send Email</h1>
            </div>
            <br></br>
            <Form className="shadow-lg p-3 mb-5 bg-white rounded"
            // onKeyPress={event => {
            //     if (event.key === 'Enter' /* Enter */) {
            //       event.preventDefault();
            //     }
            //   }}
            >
                <Container className='d-flex justify-content-center'>
                    <Form.Group className="mb-3" controlId="validationCustom01">
                        <ButtonGroup>
                        {emailTypes.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant={'outline-warning'}
                                name="radio"
                                value={radio.value}
                                checked={emailSelection == radio.value}
                                onChange={(e)=>{
                                    handleEmailSelection(e);
                                }}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                        </ButtonGroup>
                    </Form.Group>
                </Container>

                <Container className='d-flex flex-row justify-content-center'>
                    <label>
                        <input type="checkbox" checked={thisIsRouteAnnouncement} onChange={handleThisIsRouteAnnouncement} />
                        <strong>{"  Include Route Announcement Information"}</strong>
                    </label>
                </Container>
                
                {emailSelection == 1 ? 
                    <></>
                    :
                    <Container className='d-flex flex-row justify-content-center' style={{gap: "20px"}}>
                        {/* <Form.Select size="sm" style={{width: "300px"}} value={currSchool} onChange={setSchool}>
                                <option value={"null"} >{"-----"}</option>
                                {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                                    return <option value={u.id} key={i}>{u.name}</option>
                                }):null}
                        </Form.Select> */}
                        <Form.Group  style={{width: "300px"}} className="mb-3" controlId="">
                            <Select style={{width: "300px"}}  options={getSchoolOPtion()} value={schoolSelected} onChange={changeSchool}/>
                        </Form.Group>
                        {
                            emailSelection == 2 ? 
                            <></>
                            :
                            <Form.Group  style={{width: "300px"}} className="mb-3" controlId="">
                                <Select style={{width: "300px"}}  options={getRouteOption()} value={routeSelected} onChange={changeRoute}/>
                            </Form.Group>
                            // <Form.Select size="sm" style={{width: "300px"}} value={currRoute} onChange={setRoute}>
                            //     <option value={"null"} >{"-----"}</option>
                            //     {props.routes!==null && props.routes!==undefined && props.routes.length!==0?props.routes.map((u,i)=>{
                            //         return <option value={u.id} key={i}>{u.name}</option>
                            //     }):null}
                            // </Form.Select>  
                            
                            
                        }
                    </Container>
                }

                <Form.Group className="mb-3" controlId="validationCustom01">
                    <Form.Label as="h5">Subject Title</Form.Label>
                    <Form.Control 
                    required type="text"
                    placeholder="Enter Title..." 
                    value={subject}
                    onChange={(e)=>{
                        setSubject(e.target.value)
                    }}
                    onKeyPress={event => {
                        if (event.key === 'Enter' /* Enter */) {
                          event.preventDefault();
                        }
                      }}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formGridAddress1">
                    <Form.Label as="h5">Email Body</Form.Label>
                    <Form.Control 
                    as="textarea"
                    required type="text"
                    style={{ height: '300px' }}
                    placeholder="Enter Email Body..." 
                    value={body}
                    onChange={(e)=>{
                        setBody(e.target.value)
                        }}                    
                        />
                </Form.Group>

                <Button variant="yellowsubmit" type="submit" onClick={submit}>
                    Submit
                </Button>

            </Form>
        </Container> : <Container className="container-main">
                <Alert variant="danger">
                  <Alert.Heading>Access Denied</Alert.Heading>
                  <p>
                    You do not have access to this page. If you believe this is an error, contact an administrator.          
                    </p>
                  </Alert>
                </Container>
        }

    </>
  );
}

GeneralAdminEmailPage.propTypes = {
    getRoutes: PropTypes.func.isRequired,
    getSchools: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    schoollist: state.schools.schools.results,
    routes: state.routes.routes.results,
    token: state.auth.token
})

export default connect(mapStateToProps, {getSchools, getRoutes}) (GeneralAdminEmailPage);
