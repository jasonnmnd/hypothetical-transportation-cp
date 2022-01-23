import React from 'react';
import "../../adminPage.css";

const AdminRow = ( {header, data, handleViewClick}) => {
    return (
        <tr>
            {header.map((h,i)=>{
                return <td key={i}>{data[h].toString().length > 25 ? data[h].toString().slice(0,25)+"...":data[h]}</td>
            })}
            <td>
                <button onClick={() => handleViewClick(data)}>View</button>
            </td>
        </tr>
    );
};

export default AdminRow
