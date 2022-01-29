import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GeneralAdminTable from '../table/GeneralAdminTable';
import SearchBar from '../searchbar/SearchBar';


const userColumns = [
    "full_name",
    "email",
    "address",
    "groups",
]


function GeneralAdminTableView( props ) {

    const handlePrevClick = () => {
        //API Call here to get new data to display for next page
        console.log("Prev Clicked");
      }
    
      const handleNextClick = () => {
        //API Call here to get new data to display for next page
        console.log("Next Clicked");
      }
  
    const getColumns = () => {
        switch (props.tableType) {
            case "user":
                return userColumns;
            default:
                return [];
        }
    }

    return (
        <div className='table-and-buttons'>
            <h1>{props.title}</h1>
            <SearchBar buttons={getColumns()} search={props.search}></SearchBar>
            <GeneralAdminTable tableType="user"/>
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
            </div>
        </div>
    )

}

GeneralAdminTableView.propTypes = {
    title: PropTypes.string,
    tableType: PropTypes.string,
    search: PropTypes.func

}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(GeneralAdminTableView)