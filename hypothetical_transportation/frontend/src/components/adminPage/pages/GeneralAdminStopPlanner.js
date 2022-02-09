import React, { useEffect } from 'react';
import Header from '../../header/Header';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import MapContainer from '../../maps/MapContainer';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getRouteInfo } from '../../../actions/routes';
import {getStudentsInRoute} from '../../../actions/routeplanner';
import { filterObjectForKeySubstring } from '../../../utils/utils';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { updateStop } from '../../../actions/stopplanner';
import { getStopByRoute } from '../../../actions/stops';
import '../NEWadminPage.css';

//url: stop_planner/:route_id
function GeneralAdminStopPlanner(props) {
  const STUDENTS_IN_ROUTE_PREFIX = "STINROUPREF";

  const param = useParams();

  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {    
    const allSearchParams = Object.fromEntries([...searchParams]);
    let inRouteSearchParams = filterObjectForKeySubstring(allSearchParams, STUDENTS_IN_ROUTE_PREFIX);
    inRouteSearchParams.routes = param.route_id;
    props.getStudentsInRoute(inRouteSearchParams);
    props.getRouteInfo(param.route_id);
    props.getStopByRoute(param.route_id);
  }, []);

  const dragUpdate = (lag,log, stop_id)=>{
       
  }

  //things needed:
  //map with draggable and clickable stop
  //table where stops can be reordered
  //a new/edit form? (this is getting a bit cluterred...)

  //things that need to be on map: 
  //all students queried from student in route
  //stops (draggable) from getstopbyroute
  return (
    
    <>
        <Header textToDisplay={"Stop Planner"} shouldShowOptions={true}></Header>
        <Container className="container-main d-flex flex-column" style={{gap: "20px"}}>
        <Card>
            <Card.Header as="h5">Route</Card.Header>
            <Card.Body>
              <Link to={`/admin/school/${param.route_id}`}>
                  <Button variant='yellow'><h3>{props.route.name}</h3></Button>
              </Link>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Map View of Students and Stops</Card.Header>
            <Card.Body>
              {/* Map here */}
              {/* Also needs a legend */}
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Reorder Stops Within This Route</Card.Header>
            <Card.Body>
              {/* Table here */}
            </Card.Body>
        </Card>

        <Card>
            <Card.Header as="h5">Add/Change a Stop</Card.Header>
            <Card.Body>
              {/* Table here */}
            </Card.Body>
        </Card>


      </Container>
    </>

    );
}

GeneralAdminStopPlanner.propTypes = {
    getRouteInfo: PropTypes.func.isRequired,
    getStopByRoute: PropTypes.func.isRequired,
    getStudentsInRoute: PropTypes.func.isRequired,
    updateStop: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  route: state.routes.viewedRoute, 
  studentsInRoute:state.routeplanner.studentsInRoute.results,
  stops: state.stops.stops.results,
});

export default connect(mapStateToProps, {getRouteInfo,getStudentsInRoute,updateStop,getStopByRoute})(GeneralAdminStopPlanner)
