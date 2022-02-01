import React, { Fragment, useState } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import "../adminPage/adminPage.css";

function GeneralTable( props ) {

  const getValueFromPath = (path, obj) => {
    var res = path.split('.').reduce(function(currentObj, currentPathSection) {
      return currentObj && currentObj[currentPathSection];
    }, obj);
    return res;
  }
  
  

  const addTableRow = (rowData) => {
    

    return (
        <tr className={rowData["routes"] === null ? "tr-red" : "tr-gray"} >
            {
                props.columnNames.map((columnInfo, index) => {
                    const cellData = getValueFromPath(columnInfo.dataPath, rowData)
                    //console.log(columnInfo.dataPath)
                    return (
                        <td key={`${cellData}--${index}`}>
                            {cellData}
                        </td>
                    );
                })
            }
            <td>
                <button className="button" onClick={() => props.action(rowData)}>{props.actionName}</button>
            </td>
        </tr>
    )
  };

  const mapTableColumns = () => {
    return props.columnNames.map((col) => {
        //const overridedColumnName = overrideColumnName(col.colTitle);
        return (
            <th key={col.colTitle} scope="col">
                {col.colTitle}
            </th>
        );
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
    if(!results || results.length == 0){
        return null;
    }
    // mapDynamicColumns();
    return (
      <table className='center'>
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
    rows: PropTypes.array,
    actionName: PropTypes.string,
    action: PropTypes.func,
    columnNames: PropTypes.arrayOf(PropTypes.object)
}

const mapStateToProps = (state) => ({
    //rows: state.table.values.results
});

export default connect(mapStateToProps)(GeneralTable)