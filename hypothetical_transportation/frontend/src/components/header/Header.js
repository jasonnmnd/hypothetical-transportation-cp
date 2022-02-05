import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../assets/headerLogo.png';
import { Link } from 'react-router-dom';
import "./header.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";


function NEWHeader() {
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
                <Nav>
                    <NavDropdown title="Users" href='/admin/users?pageNum=1'>
                        <NavDropdown.Item as={Link} to={`/admin/users?pageNum=1`}><IoIcons.IoIosWoman /> View Users</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item as={Link} to={`/admin/new/user/`}>Create Users</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Students">
                        <NavDropdown.Item as={Link} to={`/admin/students?pageNum=1`}><IoIcons.IoIosBody /> View Students</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item as={Link} to={`/admin/new_student/`}>Create Students</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Schools">
                        <NavDropdown.Item as={Link} to={`/admin/schools?pageNum=1`}><FaIcons.FaSchool /> View Schools</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item as={Link} to={`/admin/new/school/`}> Create Schools</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Routes">
                        <NavDropdown.Item as={Link} to={`/admin/routes?pageNum=1`}><GiIcons.GiPathDistance /> View Routes</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item as={Link} to={`/`}> Create Routes</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link as={Link} to={`/account`}> Account</Nav.Link>
                    <Nav.Link as={Link} to={`/parent?pageNum=1`}> Your Parent Portal</Nav.Link>
                    <Nav.Link href={`/`}> Logout</Nav.Link>
                    
                </Nav>
            </Navbar.Collapse>
          </Navbar>
      </div>
  );
}

export default NEWHeader;
