import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { useTable } from 'react-table'
import { duplicatesExist, errorsExist, USER_COLUMNS } from '../../../../utils/bulk_import';
import "../forms/forms.css"
import "./bulk_import.css"
import { Container } from 'react-bootstrap';

function BulkImportTable(props) {

    

    

    const getTableHeader = () => {
        return (
            <tr className='tr-header' >
                {props.showRowNumbers ? <th>Row Number</th> : null}
                {props.checked ? <th>Active</th> : null}
                {props.colData.map((column, ind) => (
                    <th key={ind}>{column.header}</th>
                ))}
                {props.deleteRow ? <th>Delete</th> : null}
            </tr>
        )
    }

    const onCheck = (index) => {
        if(props.checked.includes(index)){
            props.setChecked(props.checked.filter(num => num != index))
        }
        else {
            props.setChecked([...props.checked, index])
        }
    }

    const getRowClass = (row, changed) => {
        if(changed){
            return 'row-changed'
        }
        else if(errorsExist(row)){
            return 'row-error'
        }
        else if(duplicatesExist(row)){
            return 'row-duplicate'
        }
        else {
            return ''
        }

    }

    const getRowComponent = (row, ind, changed) => {
        return (
            <tr key={ind} className={getRowClass(row, changed)}>
                {props.showRowNumbers ? <td>{ind + 1}</td> : null}
                {props.checked ? <td style={{textAlign: "center"}}><input type="checkbox" checked={props.checked.includes(ind)} onChange={() => onCheck(ind)} disabled={errorsExist(row)==true}/></td> : null }
                {props.colData.map((col, index) => {
                    return <td onClick={() => {props.setModalType(); props.setModalInfo({...row, index: ind});}} key={index} >{row[col.accessor].value}</td>
                })}
                {props.deleteRow ? <td style={{cursor: "pointer", textAlign: "center"}} onClick={() => props.deleteRow(ind)}>????</td> : null}
            </tr>
        )
    }

    const getTableRow = (rowIn, ind) => {
        let row = rowIn;
        let changed = false;
        if(ind in props.dataChanges){
            changed = true;
            row = props.dataChanges[ind];
        }

        return getRowComponent(row, ind, changed);
    }


    const getTableBody = () => {
        return (
            props.data.map((row, ind) => {
                return (
                    getTableRow(row, ind)
                )
            })
        )
    }

    if(props.data == null || props.data == undefined || props.data.length == 0){
        return null;
    }
  
    return (
        <>
             <Container className='d-flex justify-content-center'>
                <h2>{props.title}</h2>
            </Container>
            <table className="table borderd" >
                <thead>
                    {getTableHeader()}
                </thead>
                <tbody >
                    {getTableBody()}
                </tbody>
            </table>
        </>
    )
}

BulkImportTable.propTypes = {
  colData: PropTypes.array,
  data: PropTypes.array,
  setModalInfo: PropTypes.func,
  setModalType: PropTypes.func,
  dataChanges: PropTypes.object,
  checked: PropTypes.array,
  setChecked: PropTypes.func,
  title: PropTypes.string,
  deleteRow: PropTypes.func,
  showRowNumbers: PropTypes.bool
}

BulkImportTable.defaultProps = {
    showRowNumbers: false,
    setModalInfo: () => {},
    setModalType: () => {},
    dataChanges: {},
}

const mapStateToProps = (state) => ({

});



export default connect(mapStateToProps)(BulkImportTable)