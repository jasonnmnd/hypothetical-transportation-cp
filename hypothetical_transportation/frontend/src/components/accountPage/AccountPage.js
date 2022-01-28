import React from "react";
import { Link } from 'react-router-dom';
import SidebarSliding from "../adminPage/components/sidebar/SidebarSliding";
import Header from "../header/Header";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isAdmin from "../../utils/user";

function AccountPage(props){
    
    return(
        <div>
            <Header textToDisplay={isAdmin(props.user) ? "Admin Portal": "Parent Portal"}></Header>
            <SidebarSliding/>
            <div className="welcome">
                <h1>Account Details</h1>
                <p>Name: {props.user.full_name}</p>
                <p>Email: {props.user.email}</p>
                <p>Address: {props.user.address}</p>
                    <div className="button-spacing">
                        <Link to={"/account/password"}>
                            <button>Change Password</button>
                        </Link>
                        {props.user.admin? <Link to={"/admin"}>
                            <button>Back</button>
                        </Link>:<Link to={"/parent"}>
                            <button>Back</button>
                        </Link>}
                    </div>
            </div>

        </div>
    );
}


AccountPage.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.email,
        full_name: PropTypes.string,
        address: PropTypes.string,
        groups: PropTypes.arrayOf(PropTypes.number)

    })
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(AccountPage)