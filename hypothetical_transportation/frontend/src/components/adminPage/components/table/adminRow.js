import React from 'react';
import "../../adminPage.css";

const AdminRow = ( {header, data, handleViewClick}) => {
    return (
        <div className='admin-row'>
            <tr>
                {header.map((h,i)=>{
                    return <td key={i}>{data[h]}</td>
                })}
                <td>
                    <button onClick={() => handleViewClick(data.id)}>View</button>
                </td>
            </tr>
        </div>
    );
};

export default AdminRow
