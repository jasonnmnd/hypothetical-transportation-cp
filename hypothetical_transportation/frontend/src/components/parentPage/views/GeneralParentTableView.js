import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GeneralTable from '../../common/GeneralTable';
import PaginationButtons from '../../common/PaginationButtons';
import SearchBar from '../../adminPage/components/searchbar/SearchBar';

const studentColumns = [
    {
        colTitle: "Student ID",
        dataPath: "student_id"
    },
    {
        colTitle: "Full Name",
        dataPath: "full_name"
    },
    {
        colTitle: "School",
        dataPath: "school.name"
    },
    {
        colTitle: "Route",
        dataPath: "routes.name"
    },
]

const studentFilterBy = [
    {
        key: "full_name",
        text: "Full Name"
    },
    {
        key: "student_id",
        text: "Student ID"
    }
]

const studentSortBy = [
    {
        key: "full_name",
        text: "Full Name Ascending"
    },
    {
        key: "student_id",
        text: "Student ID Ascending"
    },
    {
        key: "school__name",
        text: "School Name Ascending"
    },
    {
        key: "-full_name",
        text: "Full Name Descending"
    },
    {
        key: "-student_id",
        text: "Student ID Descending"
    },
    {
        key: "-school__name",
        text: "School Name Descending"
    },
]

function GeneralParentTableView(props) {

    const nav = useNavigate();
    const handleViewClick = (student) => {
        nav(`/parent/student/${student.school.id}/${student.id}`);
    }

    const getColumns = () => {
        return studentColumns;
    }
    

    return (
        <div className='table-and-buttons'>
            <h1>{props.title}</h1>
            {props.search != null && props.search != undefined ? <SearchBar buttons={studentFilterBy} sortBy={studentSortBy} search={props.search}></SearchBar> : null}
            <div className='parentTable-container'>
                <GeneralTable rows={props.values} columnNames={getColumns()} actionName={props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}/>
            </div>
            {props.pagination != null && props.pagination != undefined ? <PaginationButtons nextDisable={!props.values || props.values.length == 0} prefix={props.pagination}/> : null}
        </div>
    )}

GeneralParentTableView.propTypes = {
    title: PropTypes.string.isRequired,
    tableType: PropTypes.string.isRequired,
    search: PropTypes.string,
    pagination: PropTypes.string,
    actionName: PropTypes.string,
    action: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.object)
}

GeneralParentTableView.defaultProps = {
    pagination: "",
    search: ""
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(GeneralParentTableView)