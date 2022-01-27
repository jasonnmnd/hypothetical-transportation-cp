import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';


function AdminNewPage() {
    const navigate = useNavigate();
    const param = useParams();
    //param.column refers to "user", "school", etc
    const emptyFields = {
        user: {
          id: 0,
          full_name: "",
          email: "",
          address: "",
          password: "",
          is_staff: param.column.includes("parent")?false:true,
        },
        route: {
          id: 0,
          name: "",
          description: "",
        },
        school: {
          id: 0,
          name: "",
          address: "",
        }
    }
    const col = param.column.includes("_") ?param.column.split("_")[1]:param.column
    const [obj, setObj] = useState(emptyFields[col])
    const fields=obj!==null? Object.keys(obj).filter((i)=>param.column.includes("parent")?i!=="id"&&i!=="is_staff":i!=="id"&&i!=="address"&&i!=="is_staff"):[];
  
    return ( 
      <>
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        <div className='admin-edit-page'>
            
            <EditForm column={param.column} fields={fields} obj={obj} setobj={setObj} action={"new"}></EditForm>
            {/* <Link to={`/admin/${param.column}s`}><button>To {param.column}</button></Link> */}
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
        </div>
      </>
        );
}

export default AdminNewPage;
