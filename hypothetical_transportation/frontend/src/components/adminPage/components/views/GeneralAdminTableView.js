import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from '../searchbar/SearchBar';
import GeneralTable from '../../../common/GeneralTable';
import PaginationButtons from '../../../common/PaginationButtons';
import "../../adminPage.css";
import { getColumns, getFilterOptions, getSortOptions } from '../../../../utils/config';
import { Container } from 'react-bootstrap';

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
  
    

    return (
        <div className="d-flex justify-content-space-between flex-column" style={{gap: "20px"}}>
            {props.search != null && props.search != undefined ? <SearchBar buttons={getFilterOptions(props.tableType)} sortBy={getSortOptions(props.tableType)} search={props.search}></SearchBar> : null}
            <GeneralTable rows={props.values} columnNames={getColumns(props.tableType)} actionName={props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}/>
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