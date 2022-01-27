import React from 'react';
import "../../adminPage.css";

const AdminRow = ( {header, data, actionName, action}) => {
    return (
        <tr className={data["route"] == "" ? "tr-red" : "tr-gray"} >
            {header.map((h,i)=>{
                return <td key={i}>{data[h].toString().length > 25 ? data[h].toString().slice(0,25)+"...":data[h].toString()}</td>
            })}
            <td>
                <button onClick={() => action(data)}>{actionName}</button>
            </td>
        </tr>
    );
};

export default AdminRow