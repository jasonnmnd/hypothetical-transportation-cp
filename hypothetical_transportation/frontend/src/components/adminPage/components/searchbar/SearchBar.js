import React, { useEffect, useState } from "react";
import "./searchBar.css"
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { Form, Container, Button, Row, Col, FloatingLabel} from 'react-bootstrap';

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
        console.log(values)
        console.log(values.value.toLowerCase())
        console.log("admin".includes(values.value.toLowerCase()))
        var val = 0
        if(values.filter_by=="groups"){
            if("admin".includes(values.value.toLowerCase())){     
                setSearchParams({
                    [`${props.search}ordering`]: values.sort_by,
                    [`${props.search}groups`]: 1,
                    [`${props.search}pageNum`]: searchParams.get(`${props.search}pageNum`) == -1 ? -1 : 1,
                })
            }
            else if("parent".includes(values.value.toLowerCase()) || "guardian".includes(values.value.toLowerCase())){
                    
                setSearchParams({
                    [`${props.search}ordering`]: values.sort_by,
                    [`${props.search}groups`]: 2,
                    [`${props.search}pageNum`]: searchParams.get(`${props.search}pageNum`) == -1 ? -1 : 1,                
    
                })
            }
            else if("school staff".includes(values.value.toLowerCase()) || "schoolstaff".includes(values.value.toLowerCase())){
                
                setSearchParams({
                    [`${props.search}ordering`]: values.sort_by,
                    [`${props.search}groups`]: 3,
                    [`${props.search}pageNum`]: searchParams.get(`${props.search}pageNum`) == -1 ? -1 : 1,
                })
            }
            if("bus driver".includes(values.value.toLowerCase()) || "busdriver".includes(values.value.toLowerCase())){
                setSearchParams({
                    [`${props.search}ordering`]: values.sort_by,
                    [`${props.search}groups`]: 4,
                    [`${props.search}pageNum`]: searchParams.get(`${props.search}pageNum`) == -1 ? -1 : 1,
                })
            }
        }
        else{
            setSearchParams({
                [`${props.search}ordering`]: values.sort_by,
                [`${props.search}search`]: values.value,
                [`${props.search}search_fields`]: values.filter_by,
                [`${props.search}pageNum`]: searchParams.get(`${props.search}pageNum`) == -1 ? -1 : 1
            })
        }
    }
    return(
        <Container>
            <Row className="mb-3 d-flex flex-row justify-content-center">
                {/* <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <FloatingLabel controlId="floatingSelect" label="Sort By">
                        <Form.Select aria-label="Sort By" 
                            value={values.sort_by} onChange={(e) => setValue({ ...values, sort_by: e.target.value })}>
                            <option value={""} key={"empty"}></option>
                            {props.sortBy.map((b,i)=>{
                                // return !b.includes("-")? <option value={b} key={i}>{(b.includes("__")? b.split("__")[0] : b )+ " Asc"}</option>:<option value={b} key={i}>{(b.includes("__")? b.split("__")[0]:b).slice(1,) + " Dsc"}</option>
                                return <option value={b.key} key={i}>{b.text}</option>
                            })} 
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group> */}

                <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <FloatingLabel controlId="floatingSelect" label="Filter By">
                        <Form.Select aria-label="Filter By" value={values.filter_by} onChange={(e) => setValue({ ...values, filter_by: e.target.value })}>
                        <option value={""} key={"empty"}></option>
                        {props.buttons.map((b,i)=>{
                            return <option value={b.key} key={i}>{b.text}</option>
                        })}                                
                        </Form.Select>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <FloatingLabel controlId="floatingTextarea" label="Search By..." className="mb-3">
                        <Form.Control 
                        placeholder="Query..." 
                        onChange={(e) =>
                        setValue({ ...values, value: e.target.value })}
                        value={values.value}
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group as={Col} md="2" controlId="validationCustom01">
                    <Button variant="search" onClick={searchHandler}>Search</Button>
                </Form.Group>
            </Row>
        </Container>
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