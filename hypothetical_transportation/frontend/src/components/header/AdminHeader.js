import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../assets/headerLogo.png';
import { Link } from 'react-router-dom';
import "./header.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as IoIcons5 from "react-icons/io5";
import * as GiIcons from "react-icons/gi";
import { logout } from '../../actions/auth';
import { connect } from 'react-redux';
import isAdmin from '../../utils/user';
import getType from '../../utils/user2';

function AdminHeader( props ) {
  return (
      <div className='Header'>
          <Navbar bg="dark" variant="dark" sticky="top" expand="sm" collapseOnSelect>
            <Nav.Link as={Link} to={`/`}> 
                <Navbar.Brand>
                    <img src={logo} alt="Hypothetical Transportation Logo" width="60" height="50"></img>
                        Hypothetical Transportation
                </Navbar.Brand>
            </Nav.Link>
            <Navbar.Toggle/>
            
            <Navbar.Collapse>
                <Nav >
                        <NavDropdown title="Users">
                            <NavDropdown.Item as={Link} to={`/${getType(props.user)}/users?pageNum=1`}><IoIcons.IoIosWoman /> View Users</NavDropdown.Item>
                            {isAdmin(props.user) ? <NavDropdown.Divider/>: <></>}
                            {isAdmin(props.user) ? <NavDropdown.Item as={Link} to={`/${getType(props.user)}/new/user/`}><IoIcons5.IoCreate /> Create Users</NavDropdown.Item> : <></>}
                        </NavDropdown>
                        <NavDropdown title="Students">
                            <NavDropdown.Item as={Link} to={`/${getType(props.user)}/students?pageNum=1`}><IoIcons.IoIosBody /> View Students</NavDropdown.Item>
                            {isAdmin(props.user) ? <NavDropdown.Divider/>: <></>}
                            {isAdmin(props.user) ? <NavDropdown.Item as={Link} to={`/${getType(props.user)}/new_student/`}><IoIcons5.IoCreate /> Create Students</NavDropdown.Item> : <></>}
                        </NavDropdown>
                        <NavDropdown title="Schools">
                            <NavDropdown.Item as={Link} to={`/${getType(props.user)}/schools?pageNum=1`}><FaIcons.FaSchool /> View Schools</NavDropdown.Item>
                            {isAdmin(props.user) ? <NavDropdown.Divider/>: <></>}
                            {isAdmin(props.user) ? <NavDropdown.Item as={Link} to={`/${getType(props.user)}/new/school/`}><IoIcons5.IoCreate /> Create Schools</NavDropdown.Item> :<></>}
                        </NavDropdown>
                        <NavDropdown title="Routes">
                            <NavDropdown.Item as={Link} to={`/${getType(props.user)}/routes?pageNum=1`}><GiIcons.GiPathDistance /> View Routes</NavDropdown.Item>
                            {isAdmin(props.user) ? <NavDropdown.Divider/>: <></>}
                            {isAdmin(props.user) ? <NavDropdown.Item as={Link} to={`/${getType(props.user)}/new/route/`}><IoIcons5.IoCreate /> Create Routes</NavDropdown.Item> : <></>}
                        </NavDropdown>
                        {/* <NavDropdown title="Stops">
                            <NavDropdown.Item as={Link} to={`/`}><GiIcons.GiBusStop /> View Stops</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item as={Link} to={`/`}><IoIcons5.IoCreate /> Create Stops</NavDropdown.Item>
                        </NavDropdown> */}
                        {isAdmin(props.user) ? <Nav.Link as={Link} to={`/admin/email`}> Send Email</Nav.Link> : <></>}
                        {isAdmin(props.user) ? <Nav.Link as={Link} to={`/upload_file`}> Upload Data</Nav.Link>: <></>}
                        {/* <Nav.Link as={Link} to={`/parent?pageNum=1`}> Your Parent Portal</Nav.Link> */}
                            {/* <Navbar.Brand style={{width:'550px'}}>
                            </Navbar.Brand> */}
                        <Nav.Link as={Link} to={`/account`} style={{position:'absolute',right:'80px'}}> Account</Nav.Link>
                        <Nav.Link onClick={props.logout} style={{position:'absolute',right:'10px'}}> Logout</Nav.Link>
                    
                </Nav>
            </Navbar.Collapse>
          </Navbar>
      </div>
  );
}

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps, {logout})(AdminHeader);
