import React from "react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import SidebarSliding from "../adminPage/components/sidebar/SidebarSliding";
import Header from "../header/Header";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isAdmin from "../../utils/user";
import config from "../../utils/config";
import axios from "axios";
import { resetPassword, resetResetPassword } from '../../actions/auth'

function GeneralResetPasswordPage(props){
    const navigate = useNavigate();
    const [values, setValue] = useState({ old: "", new: "", confirm:"" });
    
    const saveNewPassword = () => {
        if (values.new === values.confirm) {
            props.resetPassword(values.old, values.new);
            

        } else {
            alert("Passwords do not match. Try again.")
        }
    }

    const resetHandler = (e) => {
        e.preventDefault();
        saveNewPassword();
      };

    const message = "";

    if(props.successfulPasswordReset){
        props.resetResetPassword();
        navigate(`/`);
    }

    return(
        <div className={"parent-page"}>
            <Header textToDisplay={isAdmin(props.user) ? "Admin Portal": "Parent Portal"} shouldShowOptions={true}></Header>
            {isAdmin(props.user)?        <SidebarSliding/>:null}
            <div className="welcome">
                <form className={"center"}>
                    <div className="form-inner">
                        <h2>Reset Passwords</h2>

                        <div className="form-group">
                            <label htmlFor="old_pass">Old Password:</label>
                            <input
                            type="old"
                            name="old"
                            id="old"
                            onChange={(e) => setValue({ ...values, old: e.target.value })}
                            value={values.old}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_pass">New Password:</label>
                            <input
                            type="new"
                            name="new"
                            id="new"
                            onChange={(e) => setValue({ ...values, new: e.target.value })}
                            value={values.new}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_pass">Confirm New Password:</label>
                            <input
                            type="confirm"
                            name="confirm"
                            id="confirm"
                            onChange={(e) => setValue({ ...values, confirm: e.target.value })}
                            value={values.confirm}
                            />
                        </div>

                        <div className="divider15px" />
                        <button onClick={resetHandler}>Confirm</button>

                        <div className="divider15px" />
                        {props.user.groups[0]==1 ? <Link to={"/account"}>
                            <button>Back</button>
                        </Link> : <Link to={"/account"}>
                            <button>Back</button>
                        </Link>}

                        {<div className="message">{message}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
}

GeneralResetPasswordPage.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        full_name: PropTypes.string,
        address: PropTypes.string,
        groups: PropTypes.arrayOf(PropTypes.number)

    })
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    token: state.auth.token,
    successfulPasswordReset: state.auth.successfulPasswordReset
});

export default connect(mapStateToProps, { resetPassword, resetResetPassword })(GeneralResetPasswordPage)