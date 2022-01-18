import React from 'react'

const ParentRow = ( {student, handleViewClick} ) => {
    return (
        <tr>
            <td>{student.name}</td>
            <td>{student.id}</td>
            <td>{student.school}</td>
            <td>{student.route}</td>
            <td>
                <button type="button" onClick={() => handleViewClick(student)}>View</button>
            </td>
        </tr>
    );
};

export default ParentRow
