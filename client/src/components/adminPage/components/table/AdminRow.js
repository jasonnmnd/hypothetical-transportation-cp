import React from 'react'

const AdminRow = ( {header, data, handleViewClick}) => {
    return (
        <tr>
            {header.map((h,i)=>{
                return <td key={i}>{data[h]}</td>
            })}
            <td>
                <button onClick={() => handleViewClick(data.id)}>View</button>
            </td>
        </tr>
    );
};

export default AdminRow
