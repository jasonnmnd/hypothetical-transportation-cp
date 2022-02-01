import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import AssistedLocationModal from '../components/modals/AssistedLocationModal';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


function AdminNewPage(props) {
    const navigate = useNavigate();
    const param = useParams();
    //param.column refers to "user", "school", etc
    const emptyFields = {
        user: {
          full_name: "",
          email: "",
          address: "",
          password: "",
          groups: param.column.includes("parent")?[2]:[1],
        },
        school: {
          name: "",
          address: "",
        }
    }
    const col = param.column.includes("_") ?param.column.split("_")[1]:param.column
    const [obj, setObj] = useState(emptyFields[col])
    // const fields=Object.keys(emptyFields[col]).filter((i)=>param.column.includes("admin")?i!=="school"&&i!=="address"&&i!=="groups":i!=="school"&&i!=="groups");
    const fields=Object.keys(emptyFields[col]).filter((i)=>i!=="school"&&i!=="groups");

    return ( 
      <>
        <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
        <SidebarSliding/>
        <div className='admin-edit-page'>
            
            <EditForm column={param.column} fields={fields} obj={obj} setobj={setObj} action={"new"}></EditForm>
            
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
        </div>
      </>
        );
}

AdminNewPage.propTypes = {
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(AdminNewPage)
