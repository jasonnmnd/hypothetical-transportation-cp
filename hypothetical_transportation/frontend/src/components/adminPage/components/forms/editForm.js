import React, { useState } from "react";
//not sure if it's going to work
//right now, for some reason when clicking on save, it redirects to /?id=input&name=input
//input1: title of form
//input2: list of fields?
//input3: a typed object matching the fields
function EditForm({title, fields, obj, setobj}) {
    const submit = (e) => {
        e.preventDefault();
        console.log(obj);
        //route to a post to save the data
    }

    return (
        <div>
            <form>
                <div className="form-inner">
                    <h2>{title}</h2>
                    {
                        fields.map((field,i)=>{
                            return (<div className="form-group" key={i}>
                            <label htmlFor={field}>{field}</label>
                            <input
                                type={field}
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
