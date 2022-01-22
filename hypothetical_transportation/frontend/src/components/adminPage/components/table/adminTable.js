import React, { Fragment, useState } from 'react';
import AdminRow from "./AdminRow";
import "../../adminPage.css";
import { useNavigate } from 'react-router-dom';
import Searchbar from "../searchbar/SearchBar"

//input1: title - text
//input2: header - list
//input3: the data - objects whose key is list and value is waht should be in table
// input2 and input3 shouhld correspond...?
//do we want to add a "route to address" input?
function AdminTable({title, header, data, search}) {
    //click and view details

    const nav = useNavigate();
    const [rowData, setData] = useState(null);

    const handleViewClick = (d) => {
        setData(d);
        console.log(d);
        //route to /title?somethingid=id => title determins routing to student, route, school, user
        if (title === 'Parent Users') {
            nav(`/admin/viewuser/${d.name}/${d.id}`);
        } 

        else if (title === 'Students'){
            nav(`/admin/viewstudent/${d.school}/${d.id}`);
        }

        else if (title === "Schools") {
            nav(`/admin/viewschool/${d.school}`);
        }

        else if (title === "Routes") {
            nav(`/admin/viewroute/${d.route}`);
        }
    };

    return (
        <div className='adminTable-container'>
            <h1>{title}</h1>
            <Searchbar buttons={header} search={search}></Searchbar>
            <table className='center'>
                <thead>
                    <tr>
                        {header.map((h,i)=>{
                            return <th key={i}>{h}</th>
                        })}
                        <th>actions</th>
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
