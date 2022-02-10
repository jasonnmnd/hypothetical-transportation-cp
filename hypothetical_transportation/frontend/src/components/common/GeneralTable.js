import React, { Fragment, useState } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import "../adminPage/adminPage.css";
import "./generalTable.css";
import { Button, Table } from 'react-bootstrap';
import { useSearchParams } from "react-router-dom";

function GeneralTable( props ) {
  let [searchParams, setSearchParams] = useSearchParams();

  const getValueFromPath = (path, obj) => {
    var res = path.split('.').reduce(function(currentObj, currentPathSection) {
      return currentObj && currentObj[currentPathSection];
    }, obj);
    return res;
  }
  
  const addTableRow = (rowData) => {
    return (
        <tr className={"tr-clickable"} onClick={() => props.action(rowData)} style={{backgroundColor: rowData["routes"] === null ? "rgb(255, 136, 136)": ""}}>
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
        </tr>
    )
  };

  const mapTableColumns = () => {
    return props.columnNames.map((col) => {
        //const overridedColumnName = overrideColumnName(col.colTitle);
        return (
            <th key={col.colTitle} scope="col">
                {col.colTitle}
                <Button variant="sortreverse" onClick={ () => searchHandler(col)}>▲</Button>
            </th>
        );
    });
  };

  // const sorting = (headerName) => {
  //   console.log(headerName)
  // }

  const overrideColumnName = (colName) => {
    switch (colName) {
        case "routeDesc":
            return "Route Description";
        default:
            return colName;
    }
  };

  const getTableRows = (results) => {
    return (results.map((result, index) => {
      return (<Fragment key={index}>
          {addTableRow(result)}
      </Fragment>);
    }))
  }

  const getEmptyTableRows = () => {
    return <tr><td>NO MORE RESULTS</td></tr>
  }


  const createTable = (results) => {
    // if(!results || results.length == 0){
    //     return null;
    // }
    // mapDynamicColumns();
    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr className="table-header-rows">
            {mapTableColumns()}
          </tr>
        </thead>
        <tbody>
          {!results || results.length == 0 ?  getEmptyTableRows() : getTableRows(results)}
        </tbody>
      </Table>
    );
  };  

  const searchHandler = (col)=>{
    setSearchParams({
        ...Object.fromEntries([...searchParams]),
        [`ordering`]: col.dataPath,
    })
}

  
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