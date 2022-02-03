import React, { useEffect, useState } from "react";
// import "../../adminPage.css"
import "./searchBar.css"
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
            [`${props.search}pageNum`]: searchParams.get(`${props.search}pageNum`) == -1 ? -1 : 1
        })
    }
    return(
        <form className="search">
            <div className="search-group">
                {props.sortBy!==undefined && props.sortBy!==null ?
                
                <label>
                    <div className="text-and-dropdown">
                        <h3>Sort By:</h3>
                        <select value={values.sort_by} onChange={(e) => setValue({ ...values, sort_by: e.target.value })}>
                        <option value={""} key={"empty"}></option>
                        {props.sortBy.map((b,i)=>{
                            // return !b.includes("-")? <option value={b} key={i}>{(b.includes("__")? b.split("__")[0] : b )+ " Asc"}</option>:<option value={b} key={i}>{(b.includes("__")? b.split("__")[0]:b).slice(1,) + " Dsc"}</option>
                            return <option value={b.key} key={i}>{b.text}</option>
                        })} 
                        </select>
                    </div>
                </label>
                
                :null}
            </div>

            <div className="search-group">    
                <label>
                    <div className="text-and-dropdown">
                        <h3>Filter By:</h3>
                        <select value={values.filter_by} onChange={(e) => setValue({ ...values, filter_by: e.target.value })}>
                        <option value={""} key={"empty"}></option>
                        {props.buttons.map((b,i)=>{
                            return <option value={b.key} key={i}>{b.text}</option>
                        })}
                    </select>
                    </div>
                </label>
            </div>

            <div className="search-group">
                <input
                    type="search"
                    name="search"
                    id="search"
                    onChange={(e) =>
                    setValue({ ...values, value: e.target.value })
                    }
                    value={values.value}
                    placeholder="Search..."
                />
            </div>
            <button onClick={searchHandler}>Search/Sort</button>
        </form>
    );
}


SearchBar.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string
    })),
    sortBy: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        text: PropTypes.string
    })),
    search: PropTypes.string
  }
  
  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  
  });
  
  export default connect(mapStateToProps)(SearchBar)