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


function AdminNewPage() {
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
        route: {
          school:0,
          name: "",
          description: "",
        },
        school: {
          name: "",
          address: "",
        }
    }
    const col = param.column.includes("_") ?param.column.split("_")[1]:param.column
    const [obj, setObj] = useState(emptyFields[col])
    const fields=Object.keys(emptyFields[col]).filter((i)=>param.column.includes("admin")?i!=="school"&&i!=="address"&&i!=="groups":i!=="school"&&i!=="groups");
  
    const [openModal, setOpenModal] = useState(false);
    const fakeAddress = "101 Wannamaker Dr, Durham NC 27708"

    const handleConfirmAddress = () => {
      console.log("Address confirmed")
    }

    return ( 
      <>
        <Header textToDisplay={"Admin Portal"}></Header>
        <SidebarSliding/>
        <div className='admin-edit-page'>
            
            <EditForm column={param.column} fields={fields} obj={obj} setobj={setObj} action={"new"}></EditForm>
            
            {openModal && <AssistedLocationModal closeModal={setOpenModal} handleConfirmAddress={handleConfirmAddress} address={fakeAddress}></AssistedLocationModal>}
            {/* <Link to={`/admin/${param.column}s`}><button>To {param.column}</button></Link> */}
            
            <button onClick={() => setOpenModal(true)}>TEST MAP MODAL BUTTON</button>
            <button onClick={() => navigate(-1)} className='button'>Go Back</button>
        </div>
      </>
        );
}

AdminNewPage.propTypes = {
    
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(AdminNewPage)
