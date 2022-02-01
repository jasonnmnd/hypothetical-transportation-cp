import React, { useState, useEffect } from 'react';
import EditForm from '../components/forms/EditForm';
import Header from '../../header/Header';
import AdminPage from '../AdminPage';
import "../adminPage.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import SidebarSliding from '../components/sidebar/SidebarSliding';
import axios from 'axios';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import config from '../../../utils/config';


function AdminEditPage(props) {
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
    axios.get(`/api/${col}/${param.id}/`, config(props.token))
        .then(res => {
            console.log(res.data)
            setobj(res.data);
            console.log(obj)
            console.log(fields)
        }).catch(err => console.log(err));
    }
    // const fields=Object.keys(emptyFields[col]).filter((i)=>param.column.includes("admin")?i!=="id"&&i!=="address"&&i!=="is_staff":i!=="id"&&i!=="is_staff");
    const fields=Object.keys(emptyFields[col]).filter((i)=>i!=="school"&&i!=="groups");
  
  useEffect(() => {
    getOldData();
  }, []);
  


  

  return (
    <>
      <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
      <SidebarSliding/>
      <div className='admin-edit-page'>  
        <EditForm column={param.column} fields={fields} obj={obj} setobj={setobj} action={"edit"}></EditForm>
        {/* <Link to={`/admin/${param.column}s`}><button>To {param.column}</button></Link> */}
        <button onClick={() => navigate(-1)} className='button'>Go Back</button>
      </div>
    </>
    );
}

AdminEditPage.propTypes = {
    
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token
});

export default connect(mapStateToProps)(AdminEditPage)

