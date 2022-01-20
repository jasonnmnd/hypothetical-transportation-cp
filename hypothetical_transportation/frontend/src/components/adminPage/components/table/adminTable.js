import React, { Fragment } from 'react'
import AdminRow from "./AdminRow"
//input1: title - text
//input2: header - list
//input3: the data - objects whose key is list and value is waht should be in table
// input2 and input3 shouhld correspond...?
//do we want to add a "route to address" input?
function AdminTable({title, header, data}) {
    //click and view details
    const handleViewClick = (id) => {
        console.log(id);
        //route to /title?somethingid=id => title determins routing to student, route, school, user
    };


    return (
        <div >
            <h1 className='center'>{title}</h1>
            <table className='center'>
                <thead>
                    <tr>
                        {header.map((h,i)=>{
                            return <th key={i}>{h}</th>
                        })}
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((d,i) => (
                        <Fragment key={i}>
                            <AdminRow header={header} data={d} handleViewClick={handleViewClick}></AdminRow>
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AdminTable
