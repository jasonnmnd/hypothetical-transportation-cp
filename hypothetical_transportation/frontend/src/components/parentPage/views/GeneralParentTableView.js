import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import GeneralTable from '../../common/GeneralTable';

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
            <div className='parentTable-container'>
                <GeneralTable rows={props.values} columnNames={getColumns()} actionName={props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}/>
            </div>
        </div>
    )}

GeneralParentTableView.propTypes = {
    title: PropTypes.string.isRequired,
    tableType: PropTypes.string.isRequired,
    search: PropTypes.func,
    actionName: PropTypes.string,
    action: PropTypes.func,
    values: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(GeneralParentTableView)