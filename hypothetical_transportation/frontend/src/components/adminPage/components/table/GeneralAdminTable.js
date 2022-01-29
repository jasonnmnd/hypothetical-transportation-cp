import React, { Fragment, useState } from 'react';
import AdminRow from "./AdminRow";
import "../../adminPage.css";
import { useNavigate } from 'react-router-dom';
import Searchbar from "../searchbar/SearchBar";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GeneralTable from '../../../common/GeneralTable';


//input1: title - text
//input2: header - list
//input3: the data - objects whose key is list and value is waht should be in table
// input2 and input3 shouhld correspond...?
//do we want to add a "route to address" input?
function GeneralAdminTable(props) {
    //click and view details

    const nav = useNavigate();

    const handleViewClick = (d) => {
        console.log("HELLO1")
        console.log(d);
        console.log("HELLO2")
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

    return (
        <div className='AdminTable-container'>
           <GeneralTable actionName = {props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}/>
        </div>
    )
}

GeneralAdminTable.propTypes = {
    title: PropTypes.string,
    header: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.func,
    actionName: PropTypes.string,
    action: PropTypes.func,
    tableType: PropTypes.string
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps)(GeneralAdminTable)