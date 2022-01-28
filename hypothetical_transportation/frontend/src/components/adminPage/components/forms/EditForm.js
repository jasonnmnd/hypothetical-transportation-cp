import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AssistedLocationModal from "../modals/AssistedLocationModal";

//not sure if it's going to work
//right now, for some reason when clicking on save, it redirects to /?id=input&name=input
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
function EditForm(props) {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const col = props.column.includes("_") ? props.column.split("_")[1]:props.column
    const submit = () => {

        // e.preventDefault();
        if(props.column.includes("route")){
            props.obj.school=props.column.split("_")[0];
        }
        
        if(action==="edit"){
            axios
                .put(`/api/${col}/${props.obj.id}/`,props.obj)
                .then(res =>{
                    // console.log(props.obj)
                    navigate(`/admin/${col}/${props.obj.id}/`)

                }).catch(err => console.log(err));
        }else if(props.action==="new"){
            console.log("new")
            console.log(props.obj)
            if(col.includes("user")){
                axios
                    .post(`/api/auth/register`,props.obj)
                    .then(res =>{
                        navigate(`/admin/${col}s/`)

                    }).catch(err => console.log(err));
            }else{            
                axios
                    .post(`/api/${col}/`,props.obj)
                    .then(res =>{
                        navigate(`/admin/${col}s/`)

                    }).catch(err => console.log(err));
            }
        }
    }

    const confirmation = (e)=>{

        e.preventDefault();
        if(column.includes("parent")){
            setOpenModal(true)
        }
        else{
            submit()
        }
    }

    const handleConfirmAddress = () => {
        console.log("Address confirmed")
        submit()
      }
    
    return (
        <div>
            {openModal && <AssistedLocationModal closeModal={setOpenModal} handleConfirmAddress={handleConfirmAddress} address={obj.address}></AssistedLocationModal>}
            <form>
                <div className="form-inner">
                    <h2>{props.action+" "+props.column}</h2>
                    {
                        props.fields.filter(f=>f!=="id"&&f!=="admin").map((field,i)=>{
                            return (<div className="form-group" key={i}>
                                <label htmlFor={field}>{field}</label>
                                <input
                                    className="input"
                                    type={typeof(props.obj[field])}
                                    name={field}
                                    id={field}
                                    value={props.obj[field]}
                                    onChange={(e)=>{
                                        setprops.obj({...props.obj, [field]: e.target.value})
                                    }}
                                />
                            </div>)
                        })
                    }
                    <div className="divider15px" />
                    
                    <button onClick={confirmation}>Save</button>
                </div>
            </form>
        </div>
    )
}

EditForm.propTypes = {
    column: PropTypes.string,
    fields: PropTypes.arrayOf(PropTypes.string),
    setobj: PropTypes.func,
    action: PropTypes.func
}

const mapStateToProps = (state) => ({

});

export default connect(mapStateToProps)(EditForm)

