import React, { useState, useEffect } from 'react';
import {InfoWindow} from '@react-google-maps/api';
import { connect } from 'react-redux';
import MapComponent from "../../maps/MapComponent";
import PropTypes, { string } from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';





function RoutePlannerMap(props){

    const [pinData, setPinData] = useState([]);

    const [extraComponents, setExtraComponents] = useState(null);

    const createInfoWindow = (position, windowComponents) => {
        setExtraComponents(<InfoWindow position={position} onCloseClick={setExtraComponents(null)}>{windowComponents}</InfoWindow>)
    }

    const onStudentClick = (pinStuff, position) => {
        createInfoWindow(position, 
            <><h3>{pinStuff.full_name}</h3><h4>{pinStuff.routes && pinStuff.routes.name}</h4></>
        )
    }

    const onSchoolClick = (pinStuff, position) => {
        createInfoWindow(position, <h1>{pinStuff.name}</h1>)
    }

    useEffect(() => {
       setPinData(getPinData())
      }, [props]);

    const getStudentsWORoute = () => {
        return props.students.filter(student => student.routes == null);
    }

    const getStudentsWCurrentRoute = () => {
        return props.students.filter(student => student.routes != null && student.routes.id == props.currentRoute);
    }
    
    const getStudentsWOtherRoute = () => {
        return props.students.filter(student => student.routes != null && student.routes.id != props.currentRoute);
    }

    const getStudentGroupsPinData = () => {
        
        return [
            {
                iconColor: "green",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick
                },
                pins: getStudentsWCurrentRoute().map(student => {return {...student, address: student.guardian.address}})
            },
            {
                iconColor: "red",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick
                },
                pins: getStudentsWORoute().map(student => {return {...student, address: student.guardian.address}})
            },
            {
                iconColor: "grey",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick
                },
                pins: getStudentsWOtherRoute().map(student => {return {...student, address: student.guardian.address}})
            },
        ]
    }
    
    const getPinData = () => {
        let pinData = getStudentGroupsPinData();
        pinData.push({
            iconColor: "black",
            iconType: "school",
            markerProps: {
                onClick: onSchoolClick
            },
            pins: [
                props.school
            ]
        })
        return pinData;
    }


    return <MapComponent pinData={pinData} otherMapComponents={extraComponents} />
}

RoutePlannerMap.propTypes = {
    students: PropTypes.array,
    school: PropTypes.object,
    currentRoute: PropTypes.number
}

RoutePlannerMap.defaultProps = {
    students: [],
    currentRoute: -1
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(RoutePlannerMap)
