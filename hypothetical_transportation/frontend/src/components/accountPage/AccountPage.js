import React from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Header from "../header/AdminHeader";
import ParentHeader from "../header/ParentHeader";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isAdmin from "../../utils/user";
import '../adminPage/NEWadminPage.css';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import getType from "../../utils/user2";

function AccountPage(props){
    
    return(
        // <div>
        //     <Header textToDisplay={isAdmin(props.user) ? "Admin Portal": "Parent Portal"} shouldShowOptions={true}></Header>
        //     {isAdmin(props.user)?        <SidebarSliding/>:null}
        //     <div className="welcome">
        //         <h1>Account Details</h1>
        //         <p>Name: {props.user.full_name}</p>
        //         <p>Email: {props.user.email}</p>
        //         <p>Address: {props.user.address}</p>
        //             <div className="button-spacing">
        //                 <Link to={"/account/password"}>
        //                     <button>Change Password</button>
        //                 </Link>
        //                 {props.user.groups[0]==1 ? <Link to={"/admin"}>
        //                     <button>Back</button>
        //                 </Link> : <Link to={"/parent"}>
        //                     <button>Back</button>
        //                 </Link>}
        //             </div>
        //     </div>

        // </div>

        <div>  
        {
            getType(props.user)!=="parent" ? <Header></Header> : <ParentHeader></ParentHeader>
          }
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        <Container className="d-flex flex-row justify-content-center align-items-center" style={{gap: "20px"}}>
            <Row>
                <Col>
                    <Link to={"/account/password"}>
                        <Button variant="yellowLong" size="lg">Change Password</Button>
                    </Link>
                </Col>

                {/* <Col>
                    {props.user.groups[0]==1 ? <Link to={"/admin"}>
                        <Button variant="yellowLong" size="lg">Back</Button>
                    </Link> : <Link to={"/parent"}>
                        <Button variant="yellowLong" size="lg">Back</Button>
                    </Link>}
                </Col> */}
            </Row>
        </Container>
        
        <Card>
            <Card.Header as="h5">Name</Card.Header>
            <Card.Body>
                <Card.Text>{props.user.full_name}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Email </Card.Header>
            <Card.Body>
                <Card.Text>{props.user.email}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Phone Number </Card.Header>
            <Card.Body>
                <Card.Text>{props.user.phone_number}</Card.Text>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Address </Card.Header>
            <Card.Body>
                <Card.Text>{props.user.address}</Card.Text>
            </Card.Body>
        </Card>
        </Container>
    </div>

    );
}


AccountPage.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        full_name: PropTypes.string,
        address: PropTypes.string,
        groups: PropTypes.arrayOf(PropTypes.number)

    })
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token
});

export default connect(mapStateToProps)(AccountPage)