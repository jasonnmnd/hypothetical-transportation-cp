import React, { useEffect, useState, Fragment } from 'react';
import Header from '../../header/AdminHeader';
import { Link, Route, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes, { string } from 'prop-types';
import '../NEWadminPage.css';
import MapComponent from '../../maps/MapComponent';
import ModifyRouteInfo from '../components/forms/ModifyRouteInfo';
import { getRouteInfo, getRoutes, resetViewedRoute } from '../../../actions/routes';
import { updateRoute, createRoute,resetPosted } from '../../../actions/routeplanner';
import { getSchool } from '../../../actions/schools';
import { getStudents, patchStudent } from '../../../actions/students';
import RoutePlannerMap from '../../maps/RoutePlannerMap';
import { NO_ROUTE } from '../../../utils/utils';
import { Container, ButtonGroup, ToggleButton, Card, Button, Form, Collapse, Modal } from 'react-bootstrap';
import IconLegend from '../../common/IconLegend';
import { getCurRouteFromStudent } from '../../../utils/planner_maps';
import { createMessageDispatch } from '../../../actions/messages';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

const IS_CREATE_PARAM = 'create';
const VIEW_PARAM = 'view';
const ROUTE_PARAM = 'route';

function RoutePlanner(props) {

  const [openDialog, setOpenDialog] = useState(false)
  

  useEffect(() => {
    props.getStudents({school: props.school_id})
  }, [props.school_id]);

  

  const changeStudentRoute = (pinStuff, position) => {
    let newID = "";
    if(getCurRouteFromStudent(pinStuff, props.studentChanges) == props.currentRouteID){
      newID = NO_ROUTE
    }
    else {
      newID = props.currentRouteID
    }
    props.setStudentChanges({
      ...props.studentChanges,
      [pinStuff.id]: newID
    })
  }

  const getAutoGroupDialog = () => {
    return (
      <Dialog
                                open={openDialog}
                                onClose={() => setOpenDialog(false)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                {"Auto-Grouping Students"}
                                </DialogTitle>
                                <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  <div>
                                    Auto-grouping the students places each student into a route based on where they live.
                                  </div>
                                  <br></br>
                                  <div>
                                    Students will be clustered into the same number of groups as there are routes for this school. Each cluster of students will then be assigned to one route. 
                                  </div>
                                  <br></br>
                                  <div>
                                    Auto-grouping will override the route placement of all students currently placed in a route. 
                                  </div>
                                  <br></br>
                                  <div>
                                    Clicking the "Auto-Group Students" button does not automatically save the results. You must still click "Save Map Changes" to save the results of the autogrouping.  
                                  </div>
                                    
                                </DialogContentText>
                                </DialogContent>
                                    <DialogActions>
                                        <Button variant='yellow' onClick={() => setOpenDialog(false)}>Close</Button>
                                    </DialogActions>
                            </Dialog>

    )
  }


  


  return (

    <Container className="container-main d-flex flex-column" style={{gap: "10px"}}>
        {getAutoGroupDialog()}
        <Container className="container-main d-flex flex-row" style={{gap: "10px"}}>

            <Container className='d-flex flex-column' style={{width: "2000px"}}>

                <IconLegend legendType='routePlanner'></IconLegend>
                <RoutePlannerMap 
                    students={props.students} 
                    school={props.school} 
                    currentRoute={props.currentRouteID} 
                    changeStudentRoute={changeStudentRoute}
                    studentChanges={props.studentChanges}
                    allRoutes={props.routes}
                />

                <br></br>

                <Container className="d-flex flex-row justify-content-center" style={{gap: "20px"}}>
                    <Button variant='yellowsubmit' onClick={props.saveRoutePlannerMapChanges}>Save Map Changes</Button>
                    <Button variant='yellowsubmit' onClick={props.resetStudentChanges}>Reset Map Changes</Button>
                    <div>
                      <Button variant='yellowsubmit' onClick={props.autoGroupStudents}>Auto-Group Students</Button>
                      <Tooltip title="Auto-Grouping Details">
                          <IconButton onClick={() => setOpenDialog(true)}>
                              <InfoIcon fontSize="medium" />
                          </IconButton>
                      </Tooltip>
                    </div>
                    
                </Container>

            </Container>
            <Container>
                <ModifyRouteInfo title={"Edit Route"} routeName={props.currentRoute.name} routeDescription={props.currentRoute.description} onSubmitFunc={(e) => props.onInfoSubmit(e, false)}/>
            </Container>
        </Container>
    </Container>

    );
}

RoutePlanner.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    updateRoute: PropTypes.func.isRequired,
    getSchool: PropTypes.func.isRequired,
    createRoute: PropTypes.func.isRequired,
    getRoutes: PropTypes.func.isRequired,
    getStudents: PropTypes.func.isRequired,
    resetViewedRoute: PropTypes.func.isRequired,
    patchStudent: PropTypes.func.isRequired,
    resetPosted: PropTypes.func.isRequired,
    createMessageDispatch: PropTypes.func.isRequired,
    currentRoute: PropTypes.object,
    currentRouteID: PropTypes.string,
    school: PropTypes.object,
    school_id: PropTypes.string,
    routes: PropTypes.array,
    onInfoSubmit: PropTypes.func,
    studentChanges: PropTypes.object,
    setStudentChanges: PropTypes.func,
    resetStudentChanges: PropTypes.func,
    saveRoutePlannerMapChanges: PropTypes.func,
    autoGroupStudents: PropTypes.func

}

const mapStateToProps = (state) => ({
  students: state.students.students.results,
  studentsInSchool: state.students.students.results,
  postedRoute: state.routeplanner.postedRoute,
});

export default connect(mapStateToProps, {createMessageDispatch, resetPosted, patchStudent, getRouteInfo, updateRoute, getSchool, createRoute, getRoutes, getStudents, resetViewedRoute})(RoutePlanner)
