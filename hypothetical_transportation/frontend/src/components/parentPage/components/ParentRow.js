import React from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


const ParentRow = ( props ) => {
    return (
        <tr>
            <td>{props.student.name}</td>
            <td>{props.student.id}</td>
            <td>{props.student.school}</td>
            <td>{props.student.route}</td>
            <td>
                <button type="button" onClick={() => props.handleViewClick(props.student)}>View</button>
            </td>
        </tr>
    );
};

ParentRow.propTypes = {
    handleViewClick: PropTypes.func
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(ParentRow)
