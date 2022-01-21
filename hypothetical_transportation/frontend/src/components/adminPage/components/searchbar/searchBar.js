import React, { useState } from "react";

//input: a list of buttons - filter by options
//search: takes in 2 inputs? the filter option, and the inputted text
function SearchBar({buttons, search}){
    const [values, setValue] = useState({by:"", value:""})
    
    const searchHandler = (e)=>{
        e.preventDefault();
        search(values);
        console.log(values)
    }
    return(
        <form className="search">
            <div className="search-inner">
                <div className="search-group">
                    <label>
                    Filter By:
                    <select value={values.by} onChange={(e) => setValue({ ...values, by: e.target.value })}>
                        <option value=''></option>
                        {buttons.map((b,i)=>{
                            return <option value={b} key={i}>{b}</option>
                        })}
                    </select>
                    </label>
                </div>
                <br></br>
                <div className="search-group">
                    <input
                        type="search"
                        name="search"
                        id="search"
                        onChange={(e) =>
                        setValue({ ...values, value: e.target.value })
                        }
                        value={values.value}
                    />
                </div>
                <br></br>
                <button onClick={searchHandler}>Search</button>
            </div>
        </form>
    );
}
export default SearchBar;