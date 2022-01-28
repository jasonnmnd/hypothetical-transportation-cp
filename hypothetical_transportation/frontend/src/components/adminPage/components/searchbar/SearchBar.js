import React, { useState } from "react";
import "../../adminPage.css"
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//input: a list of buttons - filter by options
//search: takes in 2 inputs? the filter option, and the inputted text
function SearchBar(props){
    const [values, setValue] = useState({by: props.buttons[0], value:""})
    
    const searchHandler = (e)=>{
        e.preventDefault();
        props.search(values);
        console.log(values)
    }
    return(
        <form className="search">
            <div className="search-inner">
                <div className="search-group">
                    <label>
                    Filter By:
                    <select value={values.by} onChange={(e) => setValue({ ...values, by: e.target.value })}>
                        {props.buttons.filter(k=>k!=="routes"&&k!=="school"&&k!=="groups").map((b,i)=>{
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


SearchBar.propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.string),
    search: PropTypes.func
  }
  
  const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
  
  });
  
  export default connect(mapStateToProps)(SearchBar)