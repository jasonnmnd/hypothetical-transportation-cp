import React, { useState } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";

function AdminEditPage() {
    const [obj, setobj] = useState({
        id:"123",
        name:"what",
        email:"sss@a.com",
        school:"yolo"
      });
    
    const fields=["id","name","email","school"];

  return (
      <div className='admin-edit-page'>
        <Header textToDisplay={"Admin Portal"}></Header>
        <EditForm title="Title Here" fields={fields} obj={obj} setobj={setobj}></EditForm>
        <button>Go Back</button>
      </div>
    );
}

export default AdminEditPage;
