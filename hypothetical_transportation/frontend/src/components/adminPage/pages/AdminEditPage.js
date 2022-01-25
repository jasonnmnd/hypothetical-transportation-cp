import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';


function AdminEditPage() {
  const navigate = useNavigate();
  const param = useParams();
  const col = param.column.includes("_") ?param.column.split("_")[1]:param.column
  //query the database for param.column (student/user/school/route) and id equals param.id
  const [obj, setobj] = useState(null);
  const getOldData = () => {
    axios.get(`/api/${col}/${param.id}/`)
        .then(res => {
            setobj(res.data);
        }).catch(err => console.log(err));
    }
  const fields=obj!==null? Object.keys(obj).filter((i)=>param.column.includes("parent")?i!=="id"&&i!=="admin":i!=="id"&&i!=="admin"&&i!=="address"):[];
  
  useEffect(() => {
    getOldData();
  }, []);
  


  

  return (
    <>
      <Header textToDisplay={"Admin Portal"}></Header>
      <SidebarSliding/>
      <div className='admin-edit-page'>  
        <EditForm column={param.column} fields={fields} obj={obj} setobj={setobj} action={"edit"}></EditForm>
        {/* <Link to={`/admin/${param.column}s`}><button>To {param.column}</button></Link> */}
        <button onClick={() => navigate(-1)} className='button'>Go Back</button>
      </div>
    </>
    );
}

export default AdminEditPage;
