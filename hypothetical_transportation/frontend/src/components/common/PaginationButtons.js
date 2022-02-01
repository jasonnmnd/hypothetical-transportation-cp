import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';




function PaginationButtons( props ) {


    const handlePrevClick = () => {
        props.setCurrentPage(props.currentPage - 1)
      }
    
      const handleNextClick = () => {
        props.setCurrentPage(props.currentPage + 1)
      }
  
    return (
        <div className='table-and-buttons'>
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                {props.currentPage+1}
                <button onClick={handleNextClick}>Next</button> 
            </div>
        </div>
    )

}

PaginationButtons.propTypes = {
    currentPage: PropTypes.number,
    setCurrentPage: PropTypes.func
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(PaginationButtons)