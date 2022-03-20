import React from 'react';
import "../modals/modal.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


/*
Majority of code from this tutorial to make a pop-up modal: https://www.youtube.com/watch?v=ZCvemsUfwPQ
Edited slightly for our own purposes of a confirmation screen and extra functionality
*/

function SubmitModal(props) {
  return (
    <div className='modalBackground'>
        <div className='modalContainer'>
            <div className='titleCloseBtn'>
                    <button onClick={
                        () => props.closeModal(false)
                    }> X </button>
            </div>
            <div className='title>'></div>
                <h1>Are you sure you want to submit this record?</h1>
            <div className='body'></div>
            <div className='footer'></div>
                <button onClick={
                    () => props.closeModal(false)
                } id="cancelBtn">Cancel</button>
                <button onClick={
                    () => {
                        props.handleConfirm();
                        props.closeModal(false);
                    }
                } id="confirmBtn">Continue</button>
        </div>
    </div>
  );
}

SubmitModal.propTypes = {
    closeModal: PropTypes.func,
    handleConfirm: PropTypes.func,
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(SubmitModal)
