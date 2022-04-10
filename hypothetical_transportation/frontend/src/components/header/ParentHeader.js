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
            
            <Navbar.Collapse style={{height:"40px"}}>
                <Nav >
                    {/* <NavDropdown title="">
                    </NavDropdown> */}
                    <div style={{position:'relative',height:'40px'}}></div>
                    <Nav.Link as={Link} to={`/account`} style={{position:'absolute',right:'90px'}}> Account</Nav.Link>
                    <Nav.Link onClick={props.logout} style={{position:'absolute',right:'20px'}}> Logout</Nav.Link>
                </Nav>
            </Navbar.Collapse>
          </Navbar>
      </div>
  );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {logout})(ParentHeader);
