import React from 'react';
import "./modal.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


/*
Majority of code from this tutorial to make a pop-up modal: https://www.youtube.com/watch?v=ZCvemsUfwPQ
Edited slightly for our own purposes of a confirmation screen and extra functionality
*/

function PageNavigateModal(props) {
  return (
    <div className='modalBackground'>
        <div className='modalContainer'>
            <div className='titleCloseBtn'>
                    <button onClick={
                        () => props.closeModal(false)
                    }> X </button>
            </div>
            <div className='title>'></div>
                <h1>{props.message}</h1>
            <div className='body'></div>
                <p>{props.question}</p>
            <div className='footer'></div>
                <button onClick={
                    () => {
                        props.yesFunc();
                        props.closeModal(false);
                    }
                } id="cancelBtn">Yes</button>
                <button onClick={
                    () => {
                        props.noFunc();
                        props.closeModal(false);
                    }
                } id="confirmBtn">No</button>
        </div>
    </div>
  );
}

PageNavigateModal.propTypes = {
    closeModal: PropTypes.func,
    yesFunc: PropTypes.func,
    noFunc: PropTypes.func,
    message: PropTypes.string,
    question: PropTypes.string,
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(PageNavigateModal)
