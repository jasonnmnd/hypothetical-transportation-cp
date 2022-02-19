import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import logo from '../assets/headerLogo.png';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/auth';
import { connect } from 'react-redux';
import "./header.css";

function PlainHeader(props) {
  return (
      <div className='Header'>
          <Navbar bg="dark" variant="dark" sticky="top">
            <Nav.Link as={Link} to={`/`}>
                    <Navbar.Brand>
                        <img src={logo} alt="Hypothetical Transportation Logo" width="60" height="50"></img>
                            Hypothetical Transportation
                    </Navbar.Brand>
                </Nav.Link>
          </Navbar>
      </div>
  );
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {logout})(PlainHeader);
