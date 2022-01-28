import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AssistedLocationModal from "../modals/AssistedLocationModal";

//not sure if it's going to work
//right now, for some reason when clicking on save, it redirects to /?id=input&name=input
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
function EditForm({column, fields, obj, setobj, action}) {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const col = column.includes("_") ?column.split("_")[1]:column
    const submit = () => {

        // e.preventDefault();
        if(column.includes("route")){
            obj.school=column.split("_")[0];
        }
        
        if(action==="edit"){
            axios
                .put(`/api/${col}/${obj.id}/`,obj)
                .then(res =>{
                    // console.log(obj)
                    navigate(`/admin/${col}/${obj.id}/`)

                }).catch(err => console.log(err));
        }else if(action==="new"){
            console.log("new")
            console.log(obj)
            if(col.includes("user")){
                axios
                    .post(`/api/auth/register`,obj)
                    .then(res =>{
                        navigate(`/admin/${col}s/`)

                    }).catch(err => console.log(err));
            }else{            
                axios
                    .post(`/api/${col}/`,obj)
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
                    <h2>{action+" "+column}</h2>
                    {
                        fields.filter(f=>f!=="id"&&f!=="admin").map((field,i)=>{
                            return (<div className="form-group" key={i}>
                                <label htmlFor={field}>{field}</label>
                                <input
                                    className="input"
                                    type={typeof(obj[field])}
                                    name={field}
                                    id={field}
                                    value={obj[field]}
                                    onChange={(e)=>{
                                        setobj({...obj, [field]: e.target.value})
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

export default EditForm