import React, {Fragment} from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Card } from 'react-bootstrap';
import { getIcon, SCHOOL_LEGEND, SCHOOL_MARKER, STOP_LEGEND, STOP_MARKER, STUDENT_CHECK_LEGEND, STUDENT_CHECK_MARKER, STUDENT_MARKER, STUDENT_MULTIPLE_LEGEND, STUDENT_X_LEGEND } from '../maps/static/markers'
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';


function IconLegend(props) {



    const routePlannerLegend = [
        {
            key: "School: ",
            icon: SCHOOL_LEGEND("white")
        },

        {
            key: "Students in This Route: ",
            icon: STUDENT_CHECK_LEGEND("green")
        },

        {
            key: "Students on Other Routes: ",
            icon: STUDENT_CHECK_LEGEND("gray")
        },

        {
            key: "Students Without Route: ",
            icon: STUDENT_X_LEGEND("red")
        },
        {
            key: "Multiple Students: ",
            icon: STUDENT_MULTIPLE_LEGEND("purple")
        }
    ]

    const routeDetailsLegend = [
        {
            key: "School: ",
            icon: SCHOOL_LEGEND("white")
        },
        {
            key: "Students in This Route: ",
            icon: STUDENT_CHECK_LEGEND("green")
        },

        {
            key: "Multiple Students: ",
            icon: STUDENT_MULTIPLE_LEGEND("purple")
        },
        {
            key: "Stops: ",
            icon: STOP_LEGEND("blue")
        }
    ]

    const stopPlannerLegend = [
        {
            key: "School: ",
            icon: SCHOOL_LEGEND("white")
        },

        {
            key: "Students with In Range Stops: ",
            icon: STUDENT_CHECK_LEGEND("green")
        },

        {
            key: "Students with NO In Range Stops: ",
            icon: STUDENT_X_LEGEND("red")
        },
        {
            key: "Stops: ",
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
                    {/* {getColoredIcon(result.iconColor, result.iconType)} */}
                    {/* {<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 50" style={{height: "40px", width:"40px"}}>
                        <g fill={result.iconFill}>
                        <path d={result.iconPath}/>
                        </g>
                    </svg>} */}
                    {result.icon}
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