import React from 'react';
import "../../adminPage.css";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AdminRow = (props) => {
    return (
        <tr className={props.data["routes"] === null ? "tr-red" : "tr-gray"} >
            {props.header.map((h,i)=>{
                return <td key={i}>{props.data[h]!==null&&props.data[h]!==undefined ? props.data[h].toString().length > 25 ? props.data[h].toString().slice(0,25)+"...":props.data[h].toString():"None"}</td>
            })}
            <td>
                <button onClick={() => props.action(props.data)}>{props.actionName}</button>
            </td>
        </tr>
    );
};

AdminRow.propTypes = {
    header: PropTypes.arrayOf(PropTypes.string),
    actionName: PropTypes.string,
    action: PropTypes.func
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AdminRow)
