import React, { Fragment } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
                {col.sortable? <Button variant={searchParams.get("ordering")===col.search_key?"sort":"sortreverse"} onClick={ () => searchHandler(col)}>{searchParams.get("ordering")!==col.search_key && searchParams.get("ordering")!=="-"+col.search_key? "▲/▼":"▲"}</Button>:null}
            </th>
        );
    });
  };

  const getTableRows = (results) => {
    return (results.map((result, index) => {
      return (<Fragment key={index}>
          {addTableRow(result)}
      </Fragment>);
    }))
  }

  const getEmptyTableRows = () => {
    return <tr><td colSpan={props.columnNames.length}>NO MORE RESULTS</td></tr>
  }


  const createTable = (results) => {
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
    let key = ""
    if(searchParams.get("ordering")===col.search_key){
      key = "-"+col.search_key
    }
    else if(searchParams.get("ordering")==="-"+col.search_key){
      key = ""
    }
    else{
      key = col.search_key
    }
    setSearchParams({
        ...Object.fromEntries([...searchParams]),
        [`ordering`]: key,
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
});

export default connect(mapStateToProps)(GeneralTable)