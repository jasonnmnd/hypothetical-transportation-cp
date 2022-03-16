import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { useTable } from 'react-table'
import { USER_COLUMNS } from '../../../../utils/bulk_import';
import "../forms/forms.css"

function BulkImportTable(props) {

    

    const getTableHeader = () => {
        return (
            <tr className='tr-header' >
                {props.colData.map((column, ind) => (
                    <th key={ind}>{column.header}</th>
                ))}
            </tr>
        )
    }

    const getTableRow = (rowIn, ind) => {
        let row = rowIn
        if(ind in props.dataChanges){
            return (
                <tr key={ind} onClick={() => {props.setModalType(); props.setModalInfo({...props.dataChanges[ind], index: ind});}}>
                    {props.colData.map((col, index) => {
                        return <td key={index} >{props.dataChanges[ind][col.accessor].value}</td>
                    })}
                </tr>
            )
        }
        return (
            <tr key={ind} onClick={() => {props.setModalType(); props.setModalInfo({...row, index: ind});}}>
                {props.colData.map((col, ind) => {
                    return <td key={ind} >{row[col.accessor].value}</td>
                })}
            </tr>
        )
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

  
    return (
        <table className="table borderd" >
            <thead>
            {getTableHeader()}
            </thead>
            <tbody >
            {getTableBody()}
            </tbody>
        </table>
    )
}

BulkImportTable.propTypes = {
  colData: PropTypes.array,
  data: PropTypes.array,
  setModalInfo: PropTypes.func,
  setModalType: PropTypes.func,
  dataChanges: PropTypes.object
}

BulkImportTable.defaultProps = {
}

const mapStateToProps = (state) => ({

});



export default connect(mapStateToProps)(BulkImportTable)