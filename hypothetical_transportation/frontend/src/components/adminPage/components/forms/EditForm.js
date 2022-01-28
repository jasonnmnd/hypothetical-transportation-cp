import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//not sure if it's going to work
//right now, for some reason when clicking on save, it redirects to /?id=input&name=input
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
function EditForm(props) {
    const navigate = useNavigate();
    const col = props.column.includes("_") ?props.column.split("_")[1]:props.column
    const submit = (e) => {
        // console.log(props.column);
        // console.log(props.column.includes("admin"))
        if(props.column.includes("admin")){
            props.obj.is_staff=true;
        }
        if(props.column.includes("route")){
            props.obj.school=props.column.split("_")[0];
        }
        e.preventDefault();
        // console.log(props.obj);
        //route to a post to save the data
        if(props.action==="edit"){
            axios
                .put(`/api/${col}/${props.obj.id}/`,props.obj)
                .then(res =>{
                    // console.log(props.obj)
                    navigate(`/admin/${col}/${props.obj.id}/`)

                }).catch(err => console.log(err));
        }else if(props.action==="new"){
            console.log("new")
            console.log(props.obj)
            axios
                .post(`/api/${col}/`,props.obj)
                .then(res =>{
                    navigate(`/admin/${col}s/`)

                }).catch(err => console.log(err));
        }
    }
    
    return (
        <div>
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
                    
                    <button onClick={submit}>Save</button>
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

