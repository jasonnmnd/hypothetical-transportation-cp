import React, { useEffect, useState } from "react";
import "../../adminPage.css"
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';

//input: a list of buttons - filter by options
//search: takes in 2 inputs? the filter option, and the inputted text

function SearchBar(props){
    let [searchParams, setSearchParams] = useSearchParams();

    const getSearchFieldIfExists = (fieldName) => {
        const fieldVal = searchParams.get(fieldName);
        if (fieldVal != null && fieldVal !== undefined){
            return fieldVal;
        }
        return ""
    }

    const [values, setValue] = useState({filter_by: getSearchFieldIfExists("search_fields"), value: getSearchFieldIfExists("search"), sort_by: getSearchFieldIfExists("ordering")})
    
    const searchHandler = (e)=>{
        e.preventDefault();
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            [`${props.search}ordering`]: values.sort_by,
            [`${props.search}search`]: values.value,
            [`${props.search}search_fields`]: values.filter_by,
            [`${props.search}pageNum`]: 1
        })
    }
    return(
        <form className="search">
            <div className="search-inner">
                <div className="search-group">
                    {props.sortBy!==undefined && props.sortBy!==null ?<label>
                    Sort By:
                    <select value={values.sort_by} onChange={(e) => setValue({ ...values, sort_by: e.target.value })}>
                        <option value={""} key={"empty"}></option>
                        {props.sortBy.map((b,i)=>{
                            return !b.includes("-")? <option value={b} key={i}>{(b.includes("__")? b.split("__")[0] : b )+ " Asc"}</option>:<option value={b} key={i}>{(b.includes("__")? b.split("__")[0]:b).slice(1,) + " Dsc"}</option>
                        })}
                    </select>
                    </label>:null}
                    <label>
                    Filter By:
                    <select value={values.filter_by} onChange={(e) => setValue({ ...values, filter_by: e.target.value })}>
                        <option value={""} key={"empty"}></option>
                        {props.buttons.filter(k=>k!=="routes"&&k!=="school"&&k!=="groups"&&k!=="num_student").map((b,i)=>{
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
                <button onClick={searchHandler}>Search/Sort</button>
            </div>
        </form>
    );
}


SearchBar.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string),
    sortBy: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.func
  }
  
  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  
  });
  
  export default connect(mapStateToProps)(SearchBar)