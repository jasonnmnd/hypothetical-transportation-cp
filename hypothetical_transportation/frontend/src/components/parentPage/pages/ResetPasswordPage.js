import React from "react";
import Header from "../../header/Header";
import { useState } from "react";

function AccountPage({save}){
    const [values, setValue] = useState({ old: "", new: "", confirm:"" });
    const resetHandler = (e) => {
        e.preventDefault();
        console.log(values)
        save(values);
      };
    return(
        <div className={"parent-page"}>
            <Header textToDisplay={"Parent Portal"}></Header>
            <div className="welcome">
                <form className={"center"}>
                    <div className="form-inner">
                        <h2>Reset Passwords</h2>

                        <div className="form-group">
                            <label htmlFor="old_pass">Old Password:</label>
                            <input
                            type="old"
                            name="old"
                            id="old"
                            onChange={(e) => setValue({ ...values, old: e.target.value })}
                            value={values.old}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_pass">New Password:</label>
                            <input
                            type="new"
                            name="new"
                            id="new"
                            onChange={(e) => setValue({ ...values, new: e.target.value })}
                            value={values.new}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_pass">Confirm New Password:</label>
                            <input
                            type="confirm"
                            name="confirm"
                            id="confirm"
                            onChange={(e) => setValue({ ...values, confirm: e.target.value })}
                            value={values.confirm}
                            />
                        </div>

                        <div className="divider15px" />
                        <button onClick={resetHandler}>Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default AccountPage;