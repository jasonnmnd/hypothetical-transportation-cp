import React, { useState } from "react";

function LoginForm( {parentLogin, adminLogin, error} ) {
    const [details, setDetails] = useState({email: "", password: ""});

    const parentSubmitHandler = e => {
        e.preventDefault();
        parentLogin(details);
    }

    const adminSubmitHandler = e => {
        e.preventDefault();
        adminLogin(details);
    }

    return (
        <form>
            <div className="form-inner">
                <h2>Sign in to your account</h2>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})} value={details.email}/>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})} value={details.password}/>
                </div>

                <div class="divider15px"/>
                <button onClick={parentSubmitHandler}>Login as Parent</button>

                <div class="divider15px"/>
                <button onClick={adminSubmitHandler}>Login as Admin</button>
                
                {
                /* ERROR! */
                (error) !="" ? (<div className="error">{error}</div>) : ""
                }

            </div>
        </form>
    )
}

export default LoginForm;