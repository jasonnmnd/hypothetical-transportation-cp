import React, { Fragment, useState } from 'react';
import AdminRow from "./AdminRow";
import "../../adminPage.css";
import { useNavigate } from 'react-router-dom';
import Searchbar from "../searchbar/SearchBar";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


//input1: title - text
//input2: header - list
//input3: the data - objects whose key is list and value is waht should be in table
// input2 and input3 shouhld correspond...?
//do we want to add a "route to address" input?
function AdminTable(props) {
    //click and view details

    const nav = useNavigate();
    const [rowData, setData] = useState(null);

    const handleViewClick = (d) => {
        setData(d);
        console.log(d);
        //route to /props.title?somethingid=id => props.title determins routing to student, route, school, user
        if (props.title.toLowerCase().includes('user')) {
            nav(`/admin/user/${d.id}`);
        } 

        else if (props.title.toLowerCase().includes('student')){
            nav(`/admin/student/${d.id}`);
        }

        else if (props.title.toLowerCase().includes('school')) {
            nav(`/admin/school/${d.id}`);
        }

        else if (props.title.toLowerCase().includes('route')) {
            nav(`/admin/route/${d.id}`);
        }
    };

    return (
        <div className='adminTable-container'>
            <h1>{props.title}</h1>
            {props.search? <Searchbar buttons={props.header} search={props.search}></Searchbar> : ""}
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
                            <AdminRow header={props.header} data={d} actionName = {props.actionName?props.actionName:"View"} action={props.action? props.action:handleViewClick}></AdminRow>
                        </Fragment>
                    )):<div>Dont Query This</div>}
                </tbody>
            </table>
        </div>
    )
}

AdminTable.propTypes = {
    title: PropTypes.string,
    header: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.func,
    actionName: PropTypes.string,
    action: PropTypes.func
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AdminTable)
