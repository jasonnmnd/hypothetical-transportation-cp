import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from '../searchbar/SearchBar';
import GeneralTable from '../../../common/GeneralTable';
import PaginationButtons from '../../../common/PaginationButtons';
import "../../adminPage.css";


const userColumns = [
    {
        colTitle: "Full Name",
        dataPath: "full_name"
    },
    {
        colTitle: "Email Address",
        dataPath: "email"
    },
    {
        colTitle: "Address",
        dataPath: "address"
    },
    {
        colTitle: "Group",
        dataPath: "groups.0.name"
    },
]

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
    {
        colTitle: "Parent",
        dataPath: "guardian.full_name"
    }
]

const schoolColumns = [
    {
        colTitle: "Name",
        dataPath: "name"
    },
    {
        colTitle: "Address",
        dataPath: "address"
    },
]


// const schoolColumns = [
//     "name",
//     "address",
// ]

const routeColumns = [
    {
        colTitle: "Name",
        dataPath: "name"
    },
    {
        colTitle: "School",
        dataPath: "school.name"
    },
    {
        colTitle: "Number of Students",
        dataPath: "student_count"
    }
]

// const routeColumns = [
//     "name",
//     "description",
// ]

const userSortBy = [
    {
        key: "full_name",
        text: "Full Name Ascending"
    },
    {
        key: "email",
        text: "Email Address Ascending"
    },
    {
        key: "-full_name",
        text: "Full Name Descending"
    },
    {
        key: "-email",
        text: "Email Address Descending"
    },
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

const schoolSortBy = [
    {
        key: "name",
        text: "Name Ascending"
    },
    {
        key: "-name",
        text: "Name Descending"
    }
]

const routeSortBy = [
    {
        key: "name",
        text: "Name Ascending"
    },
    {
        key: "-name",
        text: "Name Descending"
    },,
    {
        key: "school__name",
        text: "School Name Ascending"
    },
    {
        key: "-school__name",
        text: "School Name Descending"
    },
    {
        key: "students",
        text: "Number of Students Ascending"
    },
    {
        key: "-students",
        text: "Number of Students Descending"
    },
]

const userFilterBy = [
    {
        key: "full_name",
        text: "Full Name"
    },
    {
        key: "email",
        text: "Email Address"
    }
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
const schoolFilterBy = [
    {
        key: "name",
        text: "Name"
    },
]
const routeFilterBy = [
    {
        key: "name",
        text: "Name"
    },
]


function GeneralAdminTableView( props ) {

    const nav = useNavigate();

    

    const handleViewClick = (d) => {
        //route to /props.title?somethingid=id => props.title determins routing to student, route, school, user
        //console.log(d)
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

    const getFilterOptions = () => {
        switch (props.tableType) {
            case "user":
                return userFilterBy;
            case "student":
                return studentFilterBy;
            case "school":
                return schoolFilterBy;
            case "route":
                return routeFilterBy;
            default:
                return [];
        }
    }


    

    return (
        <div className='table-and-buttons'>
            {props.search != null && props.search != undefined ? <SearchBar buttons={getFilterOptions()} sortBy={getSortOptions()} search={props.search}></SearchBar> : null}
            <div className='AdminTable-container'>
                <GeneralTable rows={props.values} columnNames={getColumns()} actionName={props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}/>
            </div>
            {props.pagination != null && props.pagination != undefined ? <PaginationButtons nextDisable={!props.values || props.values.length == 0} prefix={props.pagination}/> : null}
        </div>
    )

}

GeneralAdminTableView.propTypes = {
    title: PropTypes.string.isRequired,
    tableType: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.object),
    search: PropTypes.string,
    pagination: PropTypes.string
}

GeneralAdminTableView.defaultProps = {
    pagination: "",
    search: ""
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(GeneralAdminTableView)