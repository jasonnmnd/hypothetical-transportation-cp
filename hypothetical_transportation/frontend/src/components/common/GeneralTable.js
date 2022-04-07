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

  const getColor = (rowData)=>{
    if(props.tableType=='route'){
      if(!rowData.is_complete) return "rgb(255, 136, 136)"
    }

    if(props.tableType=='student'){
      if(rowData["routes"] === null) return "rgb(255, 136, 136)"
      if(!rowData.has_inrange_stop) return "rgb(87, 202, 255)"
    }
    return ""
  }
  
  const addTableRow = (rowData, extra) => {
    return (
        <tr className={"tr-clickable"} onClick={() => extra===true?props.extraAction(rowData):props.action(rowData)} style={{backgroundColor: getColor(rowData)}}>
            {
                props.columnNames.map((columnInfo, index) => {
                    let cellData = getValueFromPath(columnInfo.dataPath, rowData)
                    if(columnInfo.dataPath == "going_towards_school"){
                      if(cellData) {
                        cellData = "Going Towards School"
                      } else {
                        cellData = "Going Away From School"
                      }
                    }
                    
                    if(columnInfo.dataPath == "duration" && getValueFromPath("end_time", rowData) == null){
                      cellData = "Ongoing"
                      
                    }
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
    // return <tr><td colSpan={props.columnNames.length}>NO MORE RESULTS</td></tr>
    return null;
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
          {props.extraRow && props.extraRow!==null && props.extraRow!==undefined ?<Fragment>
            {addTableRow(props.extraRow, true)}
          </Fragment> : <></>}
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
    columnNames: PropTypes.arrayOf(PropTypes.object),
    extraRow: PropTypes.object,
    extraAction: PropTypes.func,
    tableType: PropTypes.string,
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(GeneralTable)