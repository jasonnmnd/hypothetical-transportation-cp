import React from "react";
import Logo from '../assets/headerLogo.png';
import './header.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

function Header( props ){

    return(
        <div className = "header">
            <div className="header-logo">
                <img src={Logo} className="logo" alt={"The logo is here"}></img>
                
            </div>

            {/* <div className="divider400px"/> */}

            <div className="header-text">
                <h1>{props.textToDisplay}</h1>
            </div>
        </div>
            
    )
}

Header.propTypes = {
    textToDisplay: PropTypes.string
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});


export default connect(mapStateToProps)(Header);