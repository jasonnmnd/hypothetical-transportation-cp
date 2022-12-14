import React, { useRef, Fragment, useEffect } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import getType from '../../utils/user2';
import { getUsers,resetPostedUser } from '../../actions/users';


function Alerts(props) {
    
    const { error, al, message } = props;


    const mounted = useRef();
    const prevErrorRef = useRef(props.error)
    const prevMessageRef = useRef(props.message)
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();


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
            if (error.msg.guardian) alert(`Guardian: ${error.msg.guardian.join()}`);
            // if (error.msg.message) alert.error(`Message: ${error.msg.message.join()}`);
            // if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
            // if (error.msg.username) alert.error(error.msg.username.join());
            prevErrorRef.current = props.error;
        }

        //if ((JSON.stringify(message)!== JSON.stringify(prevMessageRef.current))) {
        if(message!==prevMessageRef.current){
          console.log(message)
          console.log(prevMessageRef.current)
          if (message.student){
            alert(message.student);
            navigate(`/${getType(props.user)}/students/`)
          }
          if (message.user && message.user.includes("Create")){
            alert(message.user);              
            props.resetPostedUser();
            navigate(`/${getType(props.user)}/users`)

            // if(confirm(message.user + " Would you like to navigate to create a new student for them?")){
            //   navigate(`/${getType(props.user)}/new_student`)
            // }
            // else{
            //   props.resetPostedUser();
            //   navigate(`/${getType(props.user)}/users`)
            // }
          }
          else if (message.user && message.user.includes("Update")){
            alert(message.user);
            setSearchParams({
              [`pageNum`]: 1,
            })
            let paramsToSend = Object.fromEntries([...searchParams]);
            props.getUsers(paramsToSend);
          }
          else if (message.user){
            alert(message.user);
            setSearchParams({
              [`pageNum`]: 1,
            })
            let paramsToSend = Object.fromEntries([...searchParams]);
            props.getUsers(paramsToSend);
          }
          if (message.school)alert(message.school);
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
    getUsers: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  error: state.errors,
  message: state.messages,
});

export default connect(mapStateToProps, {resetPostedUser,getUsers} )(withAlert()(Alerts));