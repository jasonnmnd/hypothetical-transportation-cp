import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from '../searchbar/SearchBar';
import GeneralTable from '../../../common/GeneralTable';

const userColumns = [
    "full_name",
    "email",
    "address",
    "groups",
]

const studentColumns = [
    "student_id",
    "full_name",
    "school",
]


const schoolColumns = [
    "name",
    "address",
]

const routeColumns = [
    "name",
    "description",
]

const userSortBy = [
    "full_name",
    "email",
    "-full_name",
    "-email"
]

const studentSortBy = [
    "full_name",
    "student_id",
    "school__name",
    "-full_name",
    "-student_id",
    "-school__name"
]

const schoolSortBy = [
    "name",
    "-name"
]

const routeSortBy = [
    "name",
    "school__name",
    "students",
    "-name",
    "-school__name",
    "-students"
]


function GeneralAdminTableView( props ) {

    const nav = useNavigate();

    const handleViewClick = (d) => {
        //route to /props.title?somethingid=id => props.title determins routing to student, route, school, user
        
        if (props.tableType == 'user') {
            nav(`/admin/user/${d.id}`);
        } 

        else if (props.tableType ==  'student'){
            nav(`/admin/student/${d.id}`);
        }

        else if (props.tableType ==  'school') {
            nav(`/admin/school/${d.id}`);
        }

        else if (props.tableType == 'route') {
            nav(`/admin/route/${d.id}`);
        }
    };

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
            case "student":
                return studentColumns;
            case "school":
                return schoolColumns;
            case "route":
                return routeColumns;
            default:
                return [];
        }
    }

    const getSortOptions = () => {
        switch (props.tableType) {
            case "user":
                return userSortBy;
            case "student":
                return studentSortBy;
            case "school":
                return schoolSortBy;
            case "route":
                return routeSortBy;
            default:
                return [];
        }
    }

    

    return (
        <div className='table-and-buttons'>
            <h1>{props.title}</h1>
            {props.search ? <SearchBar buttons={getColumns()} sortBy={getSortOptions()} search={props.search}></SearchBar> : null}
            <div className='AdminTable-container'>
                <GeneralTable rows={props.values} columnNames={getColumns()} actionName={props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}/>
            </div>
            <div className="prev-next-buttons">
                <button onClick={handlePrevClick}>Prev</button>
                <button onClick={handleNextClick}>Next</button> 
            </div>
        </div>
    )

}

GeneralAdminTableView.propTypes = {
    title: PropTypes.string.isRequired,
    tableType: PropTypes.string.isRequired,
    search: PropTypes.func,
    actionName: PropTypes.string,
    action: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(GeneralAdminTableView)