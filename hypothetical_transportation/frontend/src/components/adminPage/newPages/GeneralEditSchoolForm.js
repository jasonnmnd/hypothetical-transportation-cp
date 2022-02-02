import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../adminPage.css"
import Header from "../../header/Header";
import SidebarSliding from "../components/sidebar/SidebarSliding";
import AssistedLocationMap from "../../maps/AssistedLocationMap";

import { getSchool, updateSchool, addSchool } from "../../../actions/schools";
import AssistedLocationModal from "../components/modals/AssistedLocationModal";

//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
//input4: string action determining new or edit
function GeneralEditSchoolForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");


    const fields = [
        "name",
        "address"
    ]

    useEffect(() => {
        if(props.action == "edit"){
            props.getSchool(param.id);
            setName(props.curSchool.name);
            setAddress(props.curSchool.address);
        }
    }, []);

    const submit = () => {
        if(props.action == "edit"){
            props.updateSchool({
                name: name,
                address: address
            }, param.id);
        }
        else{
            props.addSchool({
                name: name,
                address: address
            })
        }
        navigate(`/admin/`)
    }


    // const confirmation = (e)=>{
    //     e.preventDefault();
    //     setOpenModal(true)
    // }

    // const handleConfirmAddress = () => {
    //     console.log("Address confirmed")
    //     submit()
    //   }
    
    return (
        <div>
            <SidebarSliding/>
            <Header textToDisplay={"Admin Portal"} shouldShowOptions={true}></Header>
            <div className='admin-edit-page'>  
            {/* <div className='confirm_location'>{openModal && <AssistedLocationModal closeModal={setOpenModal} handleConfirmAddress={handleConfirmAddress} address={address}></AssistedLocationModal>}</div> */}
            <form>
                <div className="form-inner">
                    <h2>{props.action + " school"}</h2>

                    <div className="form-group">
                      <label htmlFor={"Full Name"}>Name</label>
                      <input
                          className="input"
                          type={"Full Name"}
                          name={"Full Name"}
                          id={"Full Name"}
                          value={name}
                          onChange={(e)=>{
                              setName(e.target.value);
                          }}
                      />
                  </div>

                  <div className="form-group">
                      <label htmlFor={"Address"}>Address</label>
                      <input
                          className="input"
                          type={"id"}
                          name={"Address"}
                          id={"Address"}
                          value={address}
                          onChange={(e)=>{setAddress(e.target.value)}}
                      />
                  </div>
                    <div className="divider15px" />
                    <AssistedLocationMap address={address} setAddress={setAddress}></AssistedLocationMap>
                    
                    <button onClick={submit}>Save</button>
                </div>
            </form>
            </div>
        </div>
    )
}

GeneralEditSchoolForm.propTypes = {
    getSchool: PropTypes.func.isRequired,
    updateSchool: PropTypes.func.isRequired,
    addSchool: PropTypes.func.isRequired,
    action: PropTypes.string
}

const mapStateToProps = (state) => ({
    curSchool: state.schools.viewedSchool

});

export default connect(mapStateToProps, {getSchool, updateSchool, addSchool})(GeneralEditSchoolForm)

