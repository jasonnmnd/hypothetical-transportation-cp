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
          first_name: "",
          last_name: "",
          email: "",
          address: "",
          admin: false,
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
    const [obj, setObj] = useState(emptyFields[param.column])
    const fields=obj!==null? Object.keys(obj).filter((i)=>i!=="id"):[];
    
  
    return (
        <div className='admin-edit-page'>
            <Header textToDisplay={"Admin Portal"}></Header>
            <SidebarSliding/>
            <EditForm column={param.column} fields={fields} obj={obj} setobj={setObj} action={"new"}></EditForm>
            {/* <Link to={`/admin/${param.column}s`}><button>To {param.column}</button></Link> */}
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
        </div>
        );
}

export default AdminNewPage;
