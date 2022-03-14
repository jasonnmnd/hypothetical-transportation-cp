import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import { useTable } from 'react-table'
import { USER_COLUMNS } from '../../../../utils/bulk_import';
import "../forms/forms.css"

function BulkImportTable(props) {
    const columns = React.useMemo(() => props.colData, [])
    const data = React.useMemo(() => props.data, [])
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({
        columns,
        data,
    })

  
    return (
        //<></>
        <table {...getTableProps({className:"table borderd"})} >
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps({className:'tr-header'})} >
                {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
                prepareRow(row)
                return (
                <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    })}
                </tr>
                )
            })}
            </tbody>
        </table>
    )
}

BulkImportTable.propTypes = {
  colData: PropTypes.array,
  data: PropTypes.array
}

BulkImportTable.defaultProps = {
}

const mapStateToProps = (state) => ({

});



export default connect(mapStateToProps)(BulkImportTable)