import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from '../searchbar/SearchBar';
import GeneralTable from '../../../common/GeneralTable';
import PaginationButtons from '../../../common/PaginationButtons';
import "../../NEWadminPage.css";
import { getColumns, getFilterOptions, getSortOptions } from '../../../../utils/config';
import { pageSize } from '../../../../actions/utils';
import {Button} from 'react-bootstrap';
import GeneralLegend from '../../../common/GeneralLegend';
import getType from '../../../../utils/user2';

function GeneralAdminTableView( props ) {

    const nav = useNavigate();

    const handleExtraColumnClick = (d)=>{
        nav(`/${getType(props.user)}/school/${d.id}?stupageNum=1&roupageNum=1`);
    }

    const handleViewClick = (d) => {
        //route to /props.title?somethingid=id => props.title determins routing to student, route, school, user
        //console.log(d)
        if (props.tableType == 'user' && d.groups[0].id==5) {
            nav(`/${getType(props.user)}/student/${d.linked_student}?pageNum=1`);
        } 

        else if (props.tableType == 'user' && d.groups[0].id!==5) {
            nav(`/${getType(props.user)}/user/${d.id}?pageNum=1`);
        } 

        else if (props.tableType ==  'student'){
            nav(`/${getType(props.user)}/student/${d.id}?pageNum=1`);
        }

        else if (props.tableType ==  'school') {
            nav(`/${getType(props.user)}/school/${d.id}?stupageNum=1&roupageNum=1`);
        }

        else if (props.tableType == 'route') {
            nav(`/${getType(props.user)}/route/${d.id}?pageNum=1`);
        }

        else if (props.tableType == 'stop') {
            nav(`/${getType(props.user)}/stop/${d.id}?pageNum=1`);
        }
    };

    const [showSort, setSort] = useState(false);
    const toggleSort = () => {
        setSort(!showSort)
    }

    const studentLegend = [
        {
            key: " No Route ",
            color: "red",
            
        },
        {
            key: " No Stops in Range ",
            color: "blue",
        },
    ]

    const routeLegend = [
        {
            key: " Incomplete Route ",
            color: "red",
        },
        {
            key: " Route In Progress ",
            color: "blue",
        },
    ]

    if(props.totalCount == 0){
        return (
            <div className="d-flex justify-content-space-between flex-column" style={{gap: "10px"}}>
                {props.search != null && props.search != "stop" && props.search != undefined ? <Button onClick={toggleSort} variant="yellowToggle">Search Options {showSort ? "▲" : "▼"}</Button> : <></>}
                {showSort ? (props.search != null && props.search != "stop" && props.search != undefined ? <SearchBar buttons={getFilterOptions(props.tableType)} sortBy={getSortOptions(props.tableType)} search={props.search}></SearchBar> : null) : <></>}
                <h1>NO RESULTS</h1>
            </div>
        )
    }
  
    

    return (
        <div className="d-flex justify-content-space-between flex-column" style={{gap: "10px"}}>
            {props.search != null && props.search != "stop" && props.search != undefined ? <Button onClick={toggleSort} variant="yellowToggle">Search Options {showSort ? "▲" : "▼"}</Button> : <></>}
            {showSort ? (props.search != null && props.search != "stop" && props.search != undefined ? <SearchBar buttons={getFilterOptions(props.tableType)} sortBy={getSortOptions(props.tableType)} search={props.search}></SearchBar> : null) : <></>}
            {props.tableType == 'student' ? <GeneralLegend legend={studentLegend}></GeneralLegend> : <></>}
            {props.tableType == 'route' ? <GeneralLegend legend={routeLegend}></GeneralLegend> : <></>}
            <GeneralTable tableType={props.tableType} rows={props.values} columnNames={getColumns(props.tableType)} actionName={props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick} extraAction={handleExtraColumnClick} extraRow={props.extraRow}/>
            {props.pagination != null && props.pagination != undefined ? <PaginationButtons nextDisable={!props.values || props.values.length < pageSize} prefix={props.pagination} count={props.totalCount}/> : null}
        </div>
    )

}

GeneralAdminTableView.propTypes = {
    title: PropTypes.string.isRequired,
    tableType: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.object),
    extraRow: PropTypes.object,
    search: PropTypes.string,
    pagination: PropTypes.string,
    totalCount: PropTypes.number,
    action: PropTypes.func
}

GeneralAdminTableView.defaultProps = {
    pagination: "",
    search: ""
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(GeneralAdminTableView)