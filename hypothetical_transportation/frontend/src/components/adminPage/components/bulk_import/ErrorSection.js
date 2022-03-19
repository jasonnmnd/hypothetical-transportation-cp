import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Container, Modal, Row, Table } from 'react-bootstrap';
import PropTypes, { string } from 'prop-types';
import EditableTextField from '../../../common/EditableTextField';
import './bulk_import.css'
import AddressInputWithMap from '../../../common/AddressInputWithMap';
import { duplicatesExist, errOrDupExists, errorExist, STUDENT_COLUMNS, USER_COLUMNS } from '../../../../utils/bulk_import';


const ERROR_TITLES = {
    email: "Email",
    full_name: "Name",
    address: "Address",
    phone_number: "Phone Number",
    parent_email: "Parent Email",
    school_name: "School Name",
    student_id: "Student ID"
}

function ErrorSection(props){

    const getColumnTitles = () => {
        return props.type == 'user' ? USER_COLUMNS: STUDENT_COLUMNS
    }
    
    const getTableHeader = () => {
        return (
            <tr className='tr-header' >
                {getColumnTitles().map((column, ind) => (
                    <th key={ind}>{column.header}</th>
                ))}
            </tr>
        )
    }

    const getTableRow = (duplicate, ind) => {
        return (
            <tr key={ind}>
                {getColumnTitles().map((col, ind) => {
                    return <td key={ind} >{duplicate[col.accessor]}</td>
                })}
            </tr>
        )
    }

    const getTableBody = (duplicates) => {
        return (
            duplicates.map((duplicate, ind) => {
                return (
                    getTableRow(duplicate, ind)
                )
            })
        )
    }
    
    
    const getDuplicateTable = (duplicates) => {
        return (
            <table className="table borderd" >
                <thead>
                    {getTableHeader()}
                </thead>
                <tbody >
                    {getTableBody(duplicates)}
                </tbody>
            </table>
        )
    }

    
    const getDuplicateSection = () => {
        return (
                    <>
                        <h5>The following are duplicates for this {props.type}: </h5>
                        {Object.keys(props.transaction).map((value, ind) => {
                            if(errOrDupExists(props.transaction, value, 'duplicates')){
                                
                                return <div key={ind}>
                                            <h6>Duplicates of {ERROR_TITLES[value]}</h6>
                                            {getDuplicateTable(props.transaction[value].duplicates)}
                                </div>
                            }
                        })}
                    </>
        )
    }

    // const errOrDupExists = (value, key) => {
    //     return props.transaction && props.transaction[value] && props.transaction[value][key] && props.transaction[value][key] != undefined && props.transaction[value][key].length > 0
    // }

    // const errorExist = () => {
    //     return props.transaction && Object.keys(props.transaction).some(value => {return errOrDupExists(props.transaction, value, 'errors')})
    // }

    // const duplicatesExist = () => {
    //     return props.transaction && Object.keys(props.transaction).some(value => {return errOrDupExists(props.transaction, value, 'duplicates')})
    // }

    const getErrorSection = () => {
        return (
            Object.keys(props.transaction).map((value, ind) => {
                return (
                    <div key={ind}>
                        <h5>{errOrDupExists(props.transaction, value, "errors") ? ERROR_TITLES[value] : null}</h5>
                        {props.transaction[value].errors?.map((error, ind) => <p key={ind}>{error}</p>)}
                    </div>
                    
                )
            })
        )
    }


    const getErrorCard = () => {
        if(errorExist(props.transaction)){
            return (
                <Card className='border-danger mb-3'>
                    <Card.Header as="h4">Errors</Card.Header>
                    <Card.Body className='text-danger'>
                        {getErrorSection()}
                    </Card.Body>
                </Card>
            )
        }
        return null;
    }

    const getDuplicateCard = () => {
        if(duplicatesExist(props.transaction)){
            return (
                <Card className='border-warning mb-3'>
                    <Card.Header as="h4">Duplicates</Card.Header>
                    <Card.Body className='text-warning'>
                        {getDuplicateSection()}
                    </Card.Body>
                </Card>
            )
        }
        return null;
    }


    return (
        <>
            {getErrorCard()}

            {getDuplicateCard()}
        </>
    )
}

ErrorSection.propTypes = {
    transaction: PropTypes.object,
    type: PropTypes.string
}

ErrorSection.defaultProps = {
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(ErrorSection)
