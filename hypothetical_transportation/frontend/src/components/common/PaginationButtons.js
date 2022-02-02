import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';




function PaginationButtons( props ) {

    let [searchParams, setSearchParams] = useSearchParams();

    const handlePrevClick = () => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            pageNum: parseInt(searchParams.get("pageNum")) - 1
        })
      }
    
      const handleNextClick = () => {
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            pageNum: parseInt(searchParams.get("pageNum")) + 1
        })
      }
  
    return (
        <div className="prev-next-buttons">
            <button onClick={handlePrevClick} disabled={searchParams.get("pageNum") == 1} >Prev</button>
            {searchParams.get("pageNum")}
            <button onClick={handleNextClick} disabled={props.nextDisable} >Next</button> 
        </div>
    )

}

PaginationButtons.propTypes = {
    //prevDisable: PropTypes.bool,
    nextDisable: PropTypes.bool
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(PaginationButtons)