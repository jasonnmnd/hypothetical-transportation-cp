import React, { useState } from "react";
import Header from "../header/Header";
import { Navigate } from "react-router-dom";
import "./login.css";
import image from "../../../public/schoolbusBackground.jpg";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from "../../actions/auth";
import isAdmin from "../../utils/user";
import TestMap from "../maps/TestMap";

function LoginForm( props ) {
  const [details, setDetails] = useState({ email: "", password: "" });

  const submitHandler = (e) => {
    e.preventDefault();
    props.login(details.email, details.password);
  };

  if (props.isAuthenticated) {
    if(isAdmin(props.user)){
      return <Navigate to="/admin" />;
    }
    return <Navigate to="/parent" />;
  }
  

  return (
      <div className="login-form" style ={ { backgroundImage: `url(${image})` } }>
        <div>
          <Header textToDisplay={"Hypothetical Transportation"}></Header>
          <form className="login" >
            <div className="form-inner">
              <h2>Sign in to your account</h2>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setDetails({ ...details, email: e.target.value })}
                  value={details.email}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) =>
                    setDetails({ ...details, password: e.target.value })
                  }
                  value={details.password}
                />
              </div>

              <div className="divider15px" />
              <div className="login-buttons">
                <button onClick={submitHandler}>Login</button>
              </div>
              <div className="divider15px" />
            </div>
          </form>
        </div>
      </div>
  );
}

LoginForm.propTypes = {
    isAuthenticated: PropTypes.bool,
    login: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps, { login })(LoginForm)