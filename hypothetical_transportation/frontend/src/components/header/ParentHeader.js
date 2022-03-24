import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../assets/headerLogo.png';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { connect } from 'react-redux';
import "./header.css";

function ParentHeader(props) {
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
                    <Navbar.Brand style={{width:'1100px'}}>
                    </Navbar.Brand>
                    <Nav.Link as={Link} to={`/account`}> Account</Nav.Link>
                    <Nav.Link onClick={props.logout}> Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
          </Navbar>
      </div>
  );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {logout})(ParentHeader);
