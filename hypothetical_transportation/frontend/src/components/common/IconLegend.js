import React, {Fragment} from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Card } from 'react-bootstrap';
import { SCHOOL_MARKER, STOP_MARKER, STUDENT_MARKER } from '../maps/static/markers'
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';


function IconLegend(props) {

    const routePlannerLegend = [
        {
            key: "School:",
            iconPath: "M0 32h16v-32h-16v32zM10 4h4v4h-4v-4zM10 12h4v4h-4v-4zM10 20h4v4h-4v-4zM2 4h4v4h-4v-4zM2 12h4v4h-4v-4zM2 20h4v4h-4v-4zM18 10h14v2h-14zM18 32h4v-8h6v8h4v-18h-14z",
            iconFill: "#000000",
        },

        {
            key: "Students in This Route:",
            iconPath: "M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z",
            iconFill: "green",
        },

        {
            key: "Students not in This Route:",
            iconPath: "M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z",
            iconFill: "gray",
        },

        {
            key: "Students Without Route:",
            iconPath: "M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z",
            iconFill: "red",
        }
    ]

    const routeDetailsLegend = [
        {
            key: "School:",
            iconPath: "M0 32h16v-32h-16v32zM10 4h4v4h-4v-4zM10 12h4v4h-4v-4zM10 20h4v4h-4v-4zM2 4h4v4h-4v-4zM2 12h4v4h-4v-4zM2 20h4v4h-4v-4zM18 10h14v2h-14zM18 32h4v-8h6v8h4v-18h-14z",
            iconFill: "#000000",
        },

        {
            key: "Students in This Route:",
            iconPath: "M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z",
            iconFill: "green",
        },

        {
            key: "Stops:",
            iconPath: "M32 18l-4-8h-6v-4c0-1.1-0.9-2-2-2h-18c-1.1 0-2 0.9-2 2v16l2 2h2.536c-0.341 0.588-0.536 1.271-0.536 2 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.729-0.196-1.412-0.536-2h11.073c-0.341 0.588-0.537 1.271-0.537 2 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.729-0.196-1.412-0.537-2h2.537v-6zM22 18v-6h4.146l3 6h-7.146z",
            iconFill: "blue",
        }
    ]

    const stopPlannerLegend = [
        {
            key: "School:",
            iconPath: "M0 32h16v-32h-16v32zM10 4h4v4h-4v-4zM10 12h4v4h-4v-4zM10 20h4v4h-4v-4zM2 4h4v4h-4v-4zM2 12h4v4h-4v-4zM2 20h4v4h-4v-4zM18 10h14v2h-14zM18 32h4v-8h6v8h4v-18h-14z",
            iconFill: "#000000",
        },

        {
            key: "Students in This Route:",
            iconPath: "M18 22.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z",
            iconFill: "green",
        },

        {
            key: "Stops:",
            iconPath: "M32 18l-4-8h-6v-4c0-1.1-0.9-2-2-2h-18c-1.1 0-2 0.9-2 2v16l2 2h2.536c-0.341 0.588-0.536 1.271-0.536 2 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.729-0.196-1.412-0.536-2h11.073c-0.341 0.588-0.537 1.271-0.537 2 0 2.209 1.791 4 4 4s4-1.791 4-4c0-0.729-0.196-1.412-0.537-2h2.537v-6zM22 18v-6h4.146l3 6h-7.146z",
            iconFill: "blue",
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
                    {<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -5 50 50" style={{height: "40px", width:"40px"}}>
                        <g fill={result.iconFill}>
                        <path d={result.iconPath}/>
                        </g>
                    </svg>}
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