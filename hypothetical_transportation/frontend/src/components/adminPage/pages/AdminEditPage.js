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
  const emptyFields = {
    user: {
      full_name: "",
      email: "",
      address: "",
    },
    route: {
      name: "",
      description: "",
    },
    school: {
      name: "",
      address: "",
    }
}
  const col = param.column.includes("_") ?param.column.split("_")[1]:param.column
  //query the database for param.column (student/user/school/route) and id equals param.id
  const [obj, setobj] = useState(emptyFields[col]);
  const getOldData = () => {
    console.log(col);
    axios.get(`/api/${col}/${param.id}/`)
        .then(res => {
            console.log(res.data)
            setobj(res.data);
            console.log(obj)
            console.log(fields)
        }).catch(err => console.log(err));
    }

  const fields=Object.keys(emptyFields[col]).filter((i)=>param.column.includes("parent")?i!=="":i!=="address");
  
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
