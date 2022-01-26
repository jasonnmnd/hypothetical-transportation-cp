import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

//not sure if it's going to wor
//right now, for some reason when clicking on save, it redirects to /?id=input&name=input
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
function EditForm({column, fields, obj, setobj, action}) {
    const navigate = useNavigate();
    const col = column.includes("_") ?column.split("_")[1]:column
    const submit = (e) => {
        // console.log(column);
        // console.log(column.includes("admin"))
        if(column.includes("admin")){
            obj.admin=true;
        }
        e.preventDefault();
        // console.log(obj);
        //route to a post to save the data
        if(action==="edit"){
            axios
                .put(`/api/${col}/${obj.id}/`,obj)
                .then(res =>{
                    // console.log(obj)
                    navigate(`/admin/${col}/${obj.id}/`)

                }).catch(err => console.log(err));
        }else if(action==="new"){
            // console.log("new")
            axios
                .post(`/api/${col}/`,obj)
                .then(res =>{
                    navigate(`/admin/${col}s/`)

                }).catch(err => console.log(err));
        }
    }
    
    return (
        <div>
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
                    
                    <button onClick={submit}>Save</button>
                </div>
            </form>
        </div>
    )
}

export default EditForm
