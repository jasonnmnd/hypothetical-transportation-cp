import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

//not sure if it's going to work
//right now, for some reason when clicking on save, it redirects to /?id=input&name=input
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
function EditForm({title, fields, obj, setobj, action}) {
    const navigate = useNavigate();
    const submit = (e) => {
        e.preventDefault();
        console.log(obj);
        //route to a post to save the data
        if(action==="edit"){
            axios
                .put(`/api/${title.slice(5,)}/${obj.id}/`,obj)
                .then(res =>{
                    console.log(obj)
                    navigate(`/admin/${title.slice(5,)}/${obj.id}/`)

                }).catch(err => console.log(err));
        }else if(action==="new"){
            console.log("new")
            axios
                .post(`/api/${title.slice(4,)}/`,obj)
                .then(res =>{
                    console.log(obj)
                    navigate(`/admin/${title.slice(4,)}s/`)

                }).catch(err => console.log(err));
        }
    }
    
    return (
        <div>
            <form>
                <div className="form-inner">
                    <h2>{title}</h2>
                    {
                        fields.filter(f=>f!=="id").map((field,i)=>{
                            return typeof(obj[field])==="boolean" ? 
                            (<div className="form-group" key={i}>
                                <label htmlFor={field}>{field}</label>
                                <input
                                    className="checkbox"
                                    type="checkbox"
                                    name={field}
                                    id={field}
                                    checked={obj[field]}
                                    onChange={(e)=>{
                                        setobj({...obj, [field]: e.target.checked})
                                    }}
                                />
                            </div>):
                            (<div className="form-group" key={i}>
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
