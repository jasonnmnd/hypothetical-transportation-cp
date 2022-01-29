import React, { Fragment, useState } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../adminPage/adminPage.css";

function GeneralTable( props ) {
  

  const [columnNames, setColumnNames] = useState([]);
  const columnsToHide = ["_id"];

  // const mapDynamicColumns = () => {
  //   Object.keys(props.rows[0]).forEach((col) => {
  //     if (!columnNames.includes(col)) {
  //       setColumnNames([...columnNames, col]);
  //     }
  //   });
  // };

  const addTableRow = (rowData) => {
    let row = [];
    props.columnNames.forEach((col) => {
      if (!columnsToHide.includes(col)) {
        row.push(
          rowData[col]
        );
      }
    });
    return (
        <tr className={rowData["routes"] === null ? "tr-red" : "tr-gray"} >
            {
                Object.keys(row).map((key, index) => {
                    return (
                        <td key={`${row[key]}--${index}`}>
                            {row[key]}
                        </td>
                    );
                })
            }
            <td>
                <button onClick={() => props.action(rowData)}>{props.actionName}</button>
            </td>
        </tr>
    )
  };

  const mapTableColumns = () => {
    return props.columnNames.map((col) => {
        if (!columnsToHide.includes(col)) {
            const overridedColumnName = overrideColumnName(col);
            return (
                <th key={col} scope="col">
                    {overridedColumnName}
                </th>
            );
        }
    });
  };

  const overrideColumnName = (colName) => {
    switch (colName) {
        case "routeDesc":
            return "Route Description";
        default:
            return colName;
    }
  };


  const createTable = (results) => {
    if(results.length == 0){
        return null;
    }
    // mapDynamicColumns();
    return (
      <table>
        <thead>
          <tr>
              {mapTableColumns()}
              <th>actions</th>
            </tr>
          
        </thead>
        <tbody>
          {results.map((result, index) => {
            return (<Fragment key={index}>
                {addTableRow(result)}
            </Fragment>);
          })}
        </tbody>
      </table>
    );
  };


  
  
  return (
      <div className="gen-table" >
        {createTable(props.rows)}
      </div>
  );
}

GeneralTable.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.obj),
    actionName: PropTypes.string,
    action: PropTypes.func,
    columnNames: PropTypes.arrayOf(PropTypes.string)
}

const mapStateToProps = (state) => ({
    rows: state.table.values.results
});

export default connect(mapStateToProps)(GeneralTable)