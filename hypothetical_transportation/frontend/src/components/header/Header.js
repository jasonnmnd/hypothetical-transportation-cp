import React from "react";
import Logo from '../assets/headerLogo.png';
import './header.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../actions/auth";
import { Link } from "react-router-dom";
import isAdmin from "../../utils/user";

function Header(props){

    return(
        <div className = "header">
            <div className="header-logo">
                <Link to={props.isAuthenticated ? (isAdmin(props.user) ? "/admin" : "/parent") : "/"}>
                    <img src={Logo} className="logo" alt={"The logo is here"}></img>
                </Link>
            </div>

            <div className="header-text">
                <h1>{props.textToDisplay}</h1>
            </div>
            
            {props.shouldShowOptions &&
            <div className="header-button">
                <Link to={"/account"}>
                  <button>Account</button> 
                </Link>
            </div>  
            }
            <div className="divider15px"></div>
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