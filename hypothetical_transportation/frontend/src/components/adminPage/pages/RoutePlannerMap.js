import React, { useState, useEffect } from 'react';
import {InfoWindow} from '@react-google-maps/api';
import { connect } from 'react-redux';
import MapComponent from "../../maps/MapComponent";
import PropTypes, { string } from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import sha256 from 'crypto-js/sha256';
import { NO_ROUTE } from '../../../utils/utils';





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
        console.log(props.studentChanges)
       setPinData(getPinData())
    }, [props]);

    
    const getCurRouteFromStudent = (student) => {
        if(props.studentChanges[student.id] != null){
            return props.studentChanges[student.id];
        }
        if(student.routes == null){
            return null;
        }
        return student.routes.id;
    }
    

    const getStudentsWORoute = () => {
        return props.students.filter(student => {
            const curRoute = getCurRouteFromStudent(student)
            return curRoute == null || curRoute == NO_ROUTE;
        });
    }

    const getStudentsWCurrentRoute = () => {
        return props.students.filter(student => {
            const curRoute = getCurRouteFromStudent(student)
            return curRoute != null && curRoute == props.currentRoute;
        });
    }
    
    const getStudentsWOtherRoute = () => {
        return props.students.filter(student => {
            const curRoute = getCurRouteFromStudent(student)
            return curRoute != null && curRoute != props.currentRoute
        });
    }

    const getStudentPin = (student) => {
        return {
            ...student, 
            address: student.guardian.address, 
            latitude: student.guardian.latitude, 
            longitude: student.guardian.longitude
        }
    }

    const getStudentGroupsPinData = () => {
        
        return [
            {
                iconColor: "green",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick,
                    onRightClick: props.changeStudentRoute
                },
                pins: getStudentsWCurrentRoute().map(student => {return getStudentPin(student)})
            },
            {
                iconColor: "red",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick,
                    onRightClick: props.changeStudentRoute
                },
                pins: getStudentsWORoute().map(student => {return getStudentPin(student)})
            },
            {
                iconColor: "grey",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick,
                    onRightClick: props.changeStudentRoute
                },
                pins: getStudentsWOtherRoute().map(student => {return getStudentPin(student)})
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
    currentRoute: PropTypes.number,
    changeStudentRoute: PropTypes.func,
    studentChanges: PropTypes.object
}

RoutePlannerMap.defaultProps = {
    students: [],
    currentRoute: -1,
    studentChanges: {}
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(RoutePlannerMap)
