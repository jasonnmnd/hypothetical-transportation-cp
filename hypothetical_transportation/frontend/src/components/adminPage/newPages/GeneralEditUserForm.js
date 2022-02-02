import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../adminPage.css"
import Header from "../../header/Header";
import SidebarSliding from "../components/sidebar/SidebarSliding";
import { getUser, updateUser } from "../../../actions/users";
import { register } from "../../../actions/auth";
import AssistedLocationModal from "../components/modals/AssistedLocationModal";
import AssistedLocationMap from "../../maps/AssistedLocationMap";

//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
//input4: string action determining new or edit
function GeneralEditUserForm(props) {
    const navigate = useNavigate();
    const param = useParams();
    const [openModal, setOpenModal] = useState(false);
    
    const [fieldValues, setFieldValues] = useState({
        full_name: "",
        address: "",
        email: "",
        groups: 1,
        password: ""
    });
    const [address, setAddress] = useState("");



    useEffect(() => {
        if(props.action == "edit"){
            props.getUser(param.id);
            setFieldValues({
                full_name: props.curUser.full_name,
                address: props.curUser.address,
                email: props.curUser.email,
                groups: props.curUser.groups[0].id
            });
            setAddress(props.curUser.address);
        }
    }, []);

    const submit = () => {
        const createVals = {
            ...fieldValues,
            groups: [fieldValues.groups],
            address: address
        }
        if(props.action == "edit"){
            props.updateUser(createVals, param.id);
        }
        else{
            props.register(createVals);
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
            <Header textToDisplay={"Modify User"} shouldShowOptions={true}></Header>
            <div className='admin-edit-page'>  
            {/* <div className='confirm_location'>{openModal && <AssistedLocationModal closeModal={setOpenModal} handleConfirmAddress={handleConfirmAddress} address={fieldValues.address}></AssistedLocationModal>}</div> */}
            <form>
                <div className="submit-form-content">
                <div className="form-inner">
                    <h2>{props.action + " user"}</h2>

                    <div className="form-group">
                      <label htmlFor={"Full Name"}>Name</label>
                      <input
                          className="input"
                          type={"Full Name"}
                          name={"Full Name"}
                          id={"Full Name"}
                          value={fieldValues.full_name}
                          onChange={(e)=>{
                              setFieldValues({...fieldValues, full_name: e.target.value});
                          }}
                      />
                  </div>

                  <div className="form-group">
                      <label htmlFor={"Email"}>Email Address</label>
                      <input
                          className="input"
                          type={"id"}
                          name={"Email"}
                          id={"Email"}
                          value={fieldValues.email}
                          onChange={
                              (e)=>{
                                setFieldValues({...fieldValues, email: e.target.value});
                                }
                            }
                      />
                  </div>

                  <div className="form-group">
                      <label>
                        Group:
                        <select value={fieldValues.groups} onChange={(e)=>{
                                setFieldValues({...fieldValues, groups: e.target.value});
                                }}>
                          <option value={1} >{"Administrator"}</option>
                          <option value={2} >{"Guardian"}</option>
                        </select>
                      </label>
                  </div>

                  <div className="form-group">
                      <label htmlFor={"Password"}>Password</label>
                      <input
                          className="input"
                          type={"password"}
                          name={"Password"}
                          id={"Password"}
                          value={fieldValues.password}
                          onChange={
                              (e)=>{
                                setFieldValues({...fieldValues, password: e.target.value});
                                }
                            }
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
                          onChange={
                              (e)=>{
                                setAddress(e.target.value);
                                }
                            }
                      />
                  </div>

                    <div className="divider15px" />
                    <AssistedLocationMap address={address} setAddress={setAddress}></AssistedLocationMap>
                    <div className="divider15px" />
                    <div className="center-buttons">
                        <button onClick={submit}>Save</button>
                    </div>
                </div>
            </div>
            </form>
            </div>
        </div>
    )
}

GeneralEditUserForm.propTypes = {
    getUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    //addSchool: PropTypes.func.isRequired,
    action: PropTypes.string,
    register: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    curUser: state.users.viewedUser

});

export default connect(mapStateToProps, {getUser, updateUser, register})(GeneralEditUserForm)

