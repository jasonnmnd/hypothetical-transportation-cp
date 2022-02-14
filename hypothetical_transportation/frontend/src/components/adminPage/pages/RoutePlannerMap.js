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
        createInfoWindow(position, <h1>{pinStuff.full_name}</h1>)
    }

    const onSchoolClick = (pinStuff, position) => {
        createInfoWindow(position, <h1>{pinStuff.name}</h1>)
    }

    useEffect(() => {
       setPinData(getPinData())
      }, [props.school, props.students]);

    const getStudentGroups = () => {
        let studentGroups = {
            noRoute: []
        };
        props.students.forEach(student => {
            if(student.routes == null){
                studentGroups.noRoute.push(student);
            } else {
                if(studentGroups[student.routes.id] == null){
                    studentGroups[student.routes.id] = []
                }
                studentGroups[student.routes.id].push(student);

            }
        });
        return studentGroups;
    }

    const getGroupColor = (routeID) => {
        const routeString = routeID.toString();
        const routeHash = sha256(routeString);
        const color = `#${routeHash.toString().substring(0, 6)}`
        return color
    }

    const getStudentGroupsPinData = () => {
        const studentGroups = getStudentGroups();
        return Object.keys(studentGroups).map(routeKey => {
            return {
                iconColor: getGroupColor(routeKey),
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick
                },
                pins: studentGroups[routeKey].map(student => {return {...student, address: student.guardian.address}})
            }
        })
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
    school: PropTypes.object
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(RoutePlannerMap)
