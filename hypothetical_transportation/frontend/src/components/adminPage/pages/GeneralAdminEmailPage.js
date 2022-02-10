import React, { useEffect, useState } from 'react';
import Header from '../../header/Header';
import "../NEWadminPage.css";
import { Container, Form, Button, ButtonGroup, ToggleButton } from 'react-bootstrap'; 
import { connect } from 'react-redux';
import { getSchools } from '../../../actions/schools';
import { getRoutesByID } from '../../../actions/routes';
import PropTypes from 'prop-types';



function GeneralAdminEmailPage(props) {

    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [currSchool, setCurrSchool] = useState("");
    const [currRoute, setCurrRoute] = useState("");
    const [emailSelection, setEmailSelection] = useState(1);
    
    const setSchool = (e) => {
        setCurrSchool(e.target.value);
        props.getRoutesByID(currSchool);
    }
    
    const setRoute = (e) => {
        setCurrRoute(e.target.value);
    }

    const submit = () => {
        console.log("Submit button pressed with school " + currSchool + " and route " + currRoute);
    }

    const emailTypes = [
        {name: "School", value: 1},
        {name: "Route", value: 2}
    ]

    useEffect(() => {
        props.getSchools();
    }, []);
  return (
    <>
        <Header></Header>
        <Container className="container-main">
            <Form className="shadow-lg p-3 mb-5 bg-white rounded">
                <Container className='d-flex justify-content-center'>
                    <Form.Group className="mb-3" controlId="validationCustom01">
                        <ButtonGroup>
                        {emailTypes.map((radio, idx) => (
                            <ToggleButton
                                key={idx}
                                id={`radio-${idx}`}
                                type="radio"
                                variant={'outline-success'}
                                name="radio"
                                value={radio.value}
                                checked={emailSelection == radio.value}
                                onChange={(e)=>{
                                    setEmailSelection(e.target.value);
                                }}
                            >
                                {radio.name}
                            </ToggleButton>
                        ))}
                        </ButtonGroup>
                    </Form.Group>
                </Container>

                <Container className='d-flex flex-row justify-content-center' style={{gap: "20px"}}>
                {
                    emailSelection == 1 ? 
                    <Form.Select size="sm" style={{width: "300px"}}>
                        <option value={"null"} >{"-----"}</option>
                        {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                            return <option value={u.id} key={i}>{u.name}</option>
                        }):null}
                    </Form.Select>
                    : 
                    <>
                       <Form.Select size="sm" style={{width: "300px"}} onChange={setSchool}>
                            {props.schoollist!==null && props.schoollist!==undefined && props.schoollist.length!==0?props.schoollist.map((u,i)=>{
                                return <option value={u.id} key={i}>{u.name}</option>
                            }):null}
                        </Form.Select>

                        <Form.Select size="sm" style={{width: "300px"}} onChange={setRoute}>
                            <option value={"null"} >{"-----"}</option>
                            {props.routes!==null && props.routes!==undefined && props.routes.length!==0?props.routes.map((u,i)=>{
                                return <option value={u.id} key={i}>{u.name}</option>
                            }):null}
                        </Form.Select> 
                    </>
                    
                }
                </Container>

                <Form.Group className="mb-3" controlId="validationCustom01">
                    <Form.Label as="h5">Subject Title</Form.Label>
                    <Form.Control 
                    required type="text"
                    placeholder="Enter Title..." 
                    value={subject}
                    onChange={(e)=>{
                        setSubject(e.target.value)
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
        </Container>

    </>
  );
}

GeneralAdminEmailPage.propTypes = {
    getRoutesByID: PropTypes.func.isRequired,
    getSchools: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    schoollist: state.schools.schools.results,
    routes: state.routes.routes.results,
})

export default connect(mapStateToProps, {getSchools, getRoutesByID}) (GeneralAdminEmailPage);
