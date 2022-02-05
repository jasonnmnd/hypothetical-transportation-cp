import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../assets/headerLogo.png';
import { Link } from 'react-router-dom';
import "./header.css";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";


function PlainHeader() {
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
                    <Nav.Link as={Link} to={`/account`}> Account</Nav.Link>
                    <Nav.Link href={`/`}> Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
          </Navbar>
      </div>
  );
}

export default PlainHeader;
