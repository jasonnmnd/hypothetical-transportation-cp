import React, { useRef, Fragment, useEffect } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


function Alerts(props) {
    
    const { error, al, message } = props;


    const mounted = useRef();
    const prevErrorRef = useRef(props.error)
    const prevMessageRef = useRef(props.message)
    const navigate = useNavigate();

    useEffect(() => {
      if (!mounted.current) {
        // do componentDidMount logic
        mounted.current = true;
      } else {
        // do componentDidUpdate logic
        if (error !== prevErrorRef.current) {
            if (error.msg.name) alert(`Name: ${error.msg.name.join()}`);
            if (error.msg.non_field_errors) alert(`${error.msg.non_field_errors.join()}`);
            if (error.msg.password) alert(`Password: ${error.msg.password.join()}`);
            if (error.msg.email) alert(`Email: ${error.msg.email.join()}`);
            if (error.msg.full_name) alert(`Name: ${error.msg.full_name.join()}`);
            if (error.msg.student_id) alert(`Student ID: ${error.msg.student_id.join()}`);
            if (error.msg.address) alert(`Parent/Address: ${error.msg.address.join()}`);
            if (error.msg.school) alert(`School: ${error.msg.school.join()}`);
            // if (error.msg.message) alert.error(`Message: ${error.msg.message.join()}`);
            // if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
            // if (error.msg.username) alert.error(error.msg.username.join());
            prevErrorRef.current = props.error;
        }

        if (message !== prevMessageRef.current) {
          if (message.student) alert(message.student);
          if (message.user && message.user.includes("Create")){
            if(confirm(message.user + " Would you like to navigate to create a new student for them?")){
              navigate(`/admin/new_student`)
            }
            else{
              navigate(`/admin/users`)
            }
          }
          if (message.user && message.user.includes("Update")){
            alert(message.user);
          }
          if (message.school) alert(message.school);
          if (message.route) alert(message.route);
          if (message.passwordNotMatch) alert(message.passwordNotMatch);
          prevMessageRef.current = props.message;
        }
      }
    });

    
    return(<Fragment />);
}

Alerts.propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps)(withAlert()(Alerts));