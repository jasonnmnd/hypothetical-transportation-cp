import React, { useEffect, useState } from "react";
// import "../../adminPage.css"
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
        setSearchParams({
            ...Object.fromEntries([...searchParams]),
            [`${props.search}ordering`]: values.sort_by,
            [`${props.search}search`]: values.value,
            [`${props.search}search_fields`]: values.filter_by,
            [`${props.search}pageNum`]: searchParams.get(`${props.search}pageNum`) == -1 ? -1 : 1
        })
    }
    return(
        <Container>
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                        <FloatingLabel controlId="floatingSelect" label="Sort By">
                            <Form.Select aria-label="Sort By" style={{width:"200px"}}
                                value={values.sort_by} onChange={(e) => setValue({ ...values, sort_by: e.target.value })}>
                                <option value={""} key={"empty"}></option>
                                {props.sortBy.map((b,i)=>{
                                    // return !b.includes("-")? <option value={b} key={i}>{(b.includes("__")? b.split("__")[0] : b )+ " Asc"}</option>:<option value={b} key={i}>{(b.includes("__")? b.split("__")[0]:b).slice(1,) + " Dsc"}</option>
                                    return <option value={b.key} key={i}>{b.text}</option>
                                })} 
                            </Form.Select>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} md="2" controlId="validationCustom01">
                        <FloatingLabel controlId="floatingSelect" label="Filter By">
                            <Form.Select aria-label="Filter By" style={{width:"200px"}} value={values.filter_by} onChange={(e) => setValue({ ...values, filter_by: e.target.value })}>
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
                        <Button variant="search" onClick={searchHandler}>Search/Sort</Button>
                    </Form.Group>
                </Row>
            </Form>
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