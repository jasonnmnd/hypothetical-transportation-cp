import React, { useState, Fragment } from 'react';
import "../parentPage.css";
import mockData from "../mock-data.json" //Mock data that we are eventually expecting from the backend
import ParentRow from './ParentRow';
import { useNavigate } from 'react-router-dom'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function ParentTable(props) {
    const nav = useNavigate();

    //useState to set data for students
    const [rowData, setData] = useState(null);

    //record which student we want to view
    const [viewStudent, setViewStudent] = useState(null);

    //Parent can click and view student
    const handleViewClick = (student) => {
        // event.preventDefault();
        setViewStudent(student.id);
        console.log(student.school);
        console.log(student.id);
        nav(`/parent/student/${student.school}/${student.id}`);
        //return <Navigate to={`/parent/viewstudent/${student.id}`}></Navigate>
    };


    return (
        <div className="parentTable-container">
            <h1>{props.title}</h1>
            <table className='center'>
                <thead>
                    <tr>
                        {props.header.map((h,i)=>{
                            return <th key={i}>{h}</th>
                        })}
                        <th>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.data!==null && props.data!==undefined?props.data.map((d,i) => (
                        <Fragment key={i}>
                            <ParentRow header={props.header} data={d} actionName = {props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}></ParentRow>
                        </Fragment>
                    )):<div>There is no kids in the system for you</div>}
                </tbody>
            </table>
        </div>
    )
}


ParentTable.propTypes = {
    title: PropTypes.string,
    header: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.func,
    actionName: PropTypes.string,
    action: PropTypes.func
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps)(ParentTable)