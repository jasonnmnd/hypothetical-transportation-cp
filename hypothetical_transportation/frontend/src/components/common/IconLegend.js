import React, {Fragment} from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Card } from 'react-bootstrap';
import { SCHOOL_MARKER, STOP_MARKER, STUDENT_MARKER } from '../maps/static/markers'
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';


function IconLegend(props) {

    const getSVGWithAnchor = (svg) => {
        const ret = {
            ...svg,
            anchor: new window.google.maps.Point(svg.anchor[0], svg.anchor[1])
        }
        return ret
    }

    const ICONS = {
        school: getSVGWithAnchor(SCHOOL_MARKER),
        student: getSVGWithAnchor(STUDENT_MARKER),
        stop: getSVGWithAnchor(STOP_MARKER)
    }

    const getColoredIcon = (color, icon) => {
        let iconData = {...ICONS[icon]};
        iconData.fillColor = color;
        return iconData;
    }

    const routePlannerLegend = [
        {
            key: "No Route: ",
            color: "🟥    "//❤️
        },
        {
            key: "In This Route: ",
            color: "🟩    "//💙
        },
        {
            key: "Not In This Route: ",
            color: "⬜    "//💙
        },
    ]

    const routePlannerLegend2 = [
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

  return (
    <Card>
        <Card.Header as="h5">Map Legend</Card.Header>
        <Card.Body>
        {
            routePlannerLegend2.map((result, index) => {
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
}

const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps)(IconLegend)