import React, {Fragment} from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Card } from 'react-bootstrap';
import { getIcon, SCHOOL_LEGEND, SCHOOL_MARKER, STOP_LEGEND, STOP_MARKER, STUDENT_CHECK_LEGEND, STUDENT_CHECK_MARKER, STUDENT_MARKER, STUDENT_MULTIPLE_LEGEND, STUDENT_OTHER_ROUTE_LEGEND, STUDENT_X_LEGEND } from '../maps/static/markers'
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';


function IconLegend(props) {



    const routePlannerLegend = [
        {
            key: "School: ",
            icon: SCHOOL_LEGEND("white")
        },

        {
            key: " Students in This Route: ",
            icon: STUDENT_CHECK_LEGEND("green")
        },

        {
            key: " Students on Other Routes: ",
            icon: STUDENT_OTHER_ROUTE_LEGEND("gray")
        },

        {
            key: " Students Without Route: ",
            icon: STUDENT_X_LEGEND("red")
        },
        {
            key: " Multiple Students: ",
            icon: STUDENT_MULTIPLE_LEGEND("purple")
        }
    ]

    const routeDetailsLegend = [
        {
            key: "School: ",
            icon: SCHOOL_LEGEND("white")
        },
        {
            key: " Students in This Route: ",
            icon: STUDENT_CHECK_LEGEND("green")
        },

        {
            key: " Multiple Students: ",
            icon: STUDENT_MULTIPLE_LEGEND("purple")
        },
        {
            key: " Stops: ",
            icon: STOP_LEGEND("blue")
        }
    ]

    const stopPlannerLegend = [
        {
            key: "School: ",
            icon: SCHOOL_LEGEND("white")
        },

        {
            key: " Students with In Range Stops: ",
            icon: STUDENT_CHECK_LEGEND("green")
        },

        {
            key: " Students with NO In Range Stops: ",
            icon: STUDENT_X_LEGEND("red")
        },
        {
            key: " Multiple Students: ",
            icon: STUDENT_MULTIPLE_LEGEND("purple")
        },
        {
            key: " Stops: ",
            icon: STOP_LEGEND("blue")
        }
    ]

    const parentStudentLegned = [
        {
            key: "Your Child: ",
            icon: STUDENT_CHECK_LEGEND("green")
        },
        {
            key: " Stops that are in range: ",
            icon: STOP_LEGEND("blue")
        }
    ]

    const getLegend = () => {
        if (props.legendType == "routePlanner") {
            return routePlannerLegend;
        } else if (props.legendType == "routeDetails") {
            return routeDetailsLegend;
        } else if (props.legendType == "stopPlanner") {
            return stopPlannerLegend;
        } else if (props.legendType=="parentStudent"){
            return parentStudentLegned;
        }
    }

  return (
    <Card>
        <Card.Header>Map Legend</Card.Header>
        <Card.Body>
        {
            getLegend().map((result, index) => {
            return (
                <Fragment key={index}>
                    {result.key}
                    {result.icon}
                    {props.legendType == "stopPlanner" ? <br></br> : <></>}
                </Fragment>
            )})
        }
        </Card.Body>
    </Card>
  )
}

IconLegend.propTypes = {
    legendType : PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(IconLegend)