import React from "react";
import Logo from '../assets/headerLogo.png';
import './header.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../actions/auth";

function Header(props){

    return(
        <div className = "header">
            <div className="header-logo">
                <img src={Logo} className="logo" alt={"The logo is here"}></img>
                
            </div>

            <div className="header-text">
                <h1>{props.textToDisplay}</h1>
            </div>
            
            {props.shouldShowOptions &&
            <div className="header-button">
                <button onClick={props.logout}>Logout</button>
            </div>
            }
        </div>
            
    )
}

Header.propTypes = {
    textToDisplay: PropTypes.string,
    shouldShowOptions: PropTypes.bool
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});


export default connect(mapStateToProps, { logout })(Header);