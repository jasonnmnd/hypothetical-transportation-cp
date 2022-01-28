import React, { useRef, Fragment, useEffect } from 'react';
import { withAlert } from 'react-alert';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


function Alerts(props) {
    
    const { error, alert, message } = props;


    const mounted = useRef();
    const prevErrorRef = useRef(props.error)
    const prevMessageRef = useRef(props.message)

    useEffect(() => {
      if (!mounted.current) {
        // do componentDidMount logic
        mounted.current = true;
      } else {
        // do componentDidUpdate logic
        if (error !== prevErrorRef.current) {
            if (error.msg.name) alert.error(error.msg.name);
            // if (error.msg.name) alert.error(`Name: ${error.msg.name.join()}`);
            // if (error.msg.email) alert.error(`Email: ${error.msg.email.join()}`);
            // if (error.msg.message) alert.error(`Message: ${error.msg.message.join()}`);
            // if (error.msg.non_field_errors) alert.error(error.msg.non_field_errors.join());
            // if (error.msg.username) alert.error(error.msg.username.join());
            prevErrorRef.current = props.error;
        }

        if (message !== prevMessageRef.current) {
          if (message.deleteLead) alert.success(message.deleteLead);
          if (message.addLead) alert.success(message.addLead);
          if (message.passwordNotMatch) alert.error(message.passwordNotMatch);
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