import React, { useState, useEffect } from 'react';
import {InfoWindow} from '@react-google-maps/api';
import { connect } from 'react-redux';
import MapComponent from "./MapComponent";
import PropTypes, { string } from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { NO_ROUTE } from '../../utils/utils';
import { getStudentPin, addSchoolPin, getStudentRouteName, getCurRouteFromStudent } from '../../utils/planner_maps';
import { getDistance } from '../../utils/geocode';
import { Button, Modal } from 'react-bootstrap';
import OverLappingStudentsModal from '../adminPage/components/modals/OverLappingStudentsModal';


const MARKER_OVERLAP_DISTANCE = 0.01; //miles


function RoutePlannerMap(props){

    const [pinData, setPinData] = useState([]);

    const [extraComponents, setExtraComponents] = useState(null);

    const [modalStudents, setModalStudents] = useState([]);

    const clearModalStudents = () => {
        setModalStudents([]);
    }

    const createInfoWindow = (position, windowComponents) => {
        setExtraComponents(<InfoWindow position={position} onCloseClick={setExtraComponents(null)}>{windowComponents}</InfoWindow>)
    }

    

    
    const getStudentInfoForWindow = (pinStuff) => {
        return <><h4>{pinStuff.full_name}</h4><h6>Route: {getStudentRouteName(pinStuff.id, pinStuff.routes, props.studentChanges, props.allRoutes)}</h6></>
    }
    
    const onStudentClick = (pinStuff, position) => {
        createInfoWindow(position, getStudentInfoForWindow(pinStuff))
    }

    const onMultipleStudentClick = (pinStuff, position) => {
        const pinStudents = pinStuff.pins;
        const windowInfo = pinStudents.map(student => getStudentInfoForWindow(student));
        createInfoWindow(position, <>{windowInfo}</>)
    }

    const multipleStudentsChange = (pinStuff, position) => {
        setModalStudents(pinStuff.pins);
    }

    const onSchoolClick = (pinStuff, position) => {
        createInfoWindow(position, <h1>{pinStuff.name}</h1>)
    }

    useEffect(() => {
       setPinData(getPinData())
    }, [props]);

    

    

    const getStudentsWORoute = (students) => {
        return students.filter(student => {
            const curRoute = getCurRouteFromStudent(student, props.studentChanges)
            return curRoute == null || curRoute == NO_ROUTE;
        });
    }

    const getStudentsWCurrentRoute = (students) => {
        return students.filter(student => {
            const curRoute = getCurRouteFromStudent(student, props.studentChanges)
            return curRoute != null && curRoute != NO_ROUTE && curRoute == props.currentRoute;
        });
    }
    
    const getStudentsWOtherRoute = (students) => {
        return students.filter(student => {
            const curRoute = getCurRouteFromStudent(student, props.studentChanges)
            return curRoute != null && curRoute != NO_ROUTE && curRoute != props.currentRoute
        });
    }

    const getOverlappedStudents = (student, studentList) => {
        let overlaps = []

        studentList.forEach(stu => {
            if(getDistance(student.guardian, stu.guardian) < MARKER_OVERLAP_DISTANCE){
                overlaps.push(stu);
                const index = studentList.indexOf(stu);
                    if (index !== -1) {
                    studentList.splice(index, 1);
                }
            }
        })
        return overlaps;
    }


    const getMarkerOverlaps = (studentsArr) => {
        let students = Array.from(studentsArr);
        let overlappingStudents = []
        let normalStudents = []

        while(students.length > 0){
            const student = students[0];
            students.splice(0, 1); // remove current student
            const overlapGroup = overlappingStudents.find(overlapStudentObj => getDistance(overlapStudentObj, student.guardian) < MARKER_OVERLAP_DISTANCE)
            if(overlapGroup != undefined){
                overlapGroup.pins.push(student);
            }
            else { //student doesn't overlap with existing overlap groups
                let studentsOverlappingWCurStudent = getOverlappedStudents(student, students);
                if(studentsOverlappingWCurStudent.length == 0){
                    normalStudents.push(student);
                }
                else { //student overlaps with a student not yet part of an overlap group, must create new group
                    const newOverlapGroupPins = [student, ...studentsOverlappingWCurStudent];

                    const avgLat = newOverlapGroupPins.reduce((sum, curPin) => sum + curPin.guardian.latitude, 0) / newOverlapGroupPins.length;
                    const avgLng = newOverlapGroupPins.reduce((sum, curPin) => sum + curPin.guardian.longitude, 0) / newOverlapGroupPins.length;
                    overlappingStudents.push({
                        latitude: avgLat,
                        longitude: avgLng,
                        pins: newOverlapGroupPins
                    })
                }
            }
        }
        
        return [overlappingStudents, normalStudents]
    }

    const getOverlappingStudentsGrouped = (overlappingStudents) => {
        let allInCurRoute = []
        let allInNoRoute = []
        let allInOtherRoute = []
        let mixedOverlap = []
        overlappingStudents.forEach(studentGroup => {
            if(studentGroup.pins.every(student => getCurRouteFromStudent(student, props.studentChanges) == props.currentRoute)){
                allInCurRoute.push(studentGroup);
            }
            else if(studentGroup.pins.every(student => getCurRouteFromStudent(student, props.studentChanges) == null)){
                allInNoRoute.push(studentGroup);
            }
            else if(studentGroup.pins.every(student => getCurRouteFromStudent(student, props.studentChanges) != null &&  getCurRouteFromStudent(student, props.studentChanges) != props.currentRoute)){
                allInOtherRoute.push(studentGroup);
            }
            else{
                mixedOverlap.push(studentGroup);
            }
        })
        return [allInCurRoute, allInOtherRoute, allInNoRoute, mixedOverlap]
    }

    const getOverlapPinGroup = (pinInfo, color) => {
        return {
            iconColor: color,
            iconType: "studentMultiple",
            markerProps: {
                onRightClick: onMultipleStudentClick,
                onClick: multipleStudentsChange
            },
            pins: pinInfo
        }
    }

    const getStudentGroupsPinData = () => {
        //const normalStudents = props.students;
        const [overlappingStudents, normalStudents] = getMarkerOverlaps(props.students);
        const [allInCurRoute, allInOtherRoute, allInNoRoute, mixedOverlap] = getOverlappingStudentsGrouped(overlappingStudents);
        return [
            {
                iconColor: "green",
                iconType: "studentCheck",
                markerProps: {
                    onRightClick: onStudentClick,
                    onClick: props.changeStudentRoute
                },
                pins: getStudentsWCurrentRoute(normalStudents).map(student => {return getStudentPin(student)})
            },
            {
                iconColor: "red",
                iconType: "studentX",
                markerProps: {
                    onRightClick: onStudentClick,
                    onClick: props.changeStudentRoute
                },
                pins: getStudentsWORoute(normalStudents).map(student => {return getStudentPin(student)})
            },
            {
                iconColor: "grey",
                iconType: "student",
                markerProps: {
                    onRightClick: onStudentClick,
                    onClick: props.changeStudentRoute
                },
                pins: getStudentsWOtherRoute(normalStudents).map(student => {return getStudentPin(student)})
            },
            getOverlapPinGroup(mixedOverlap, "purple"),
            getOverlapPinGroup(allInCurRoute, "green"),
            getOverlapPinGroup(allInOtherRoute, "grey"),
            getOverlapPinGroup(allInNoRoute, "red")
        ]
    }
    
    const getPinData = () => {
        let pinData = getStudentGroupsPinData();
        addSchoolPin(pinData, props.school, onSchoolClick)
        return pinData;
    }


    return (
        <>
            <OverLappingStudentsModal 
                students={modalStudents} 
                closeModal={clearModalStudents} 
                studentChanges={props.studentChanges} 
                allRoutes={props.allRoutes} 
                changeStudentRoute={props.changeStudentRoute}
                currentRoute={props.currentRoute}
            />
            <MapComponent 
                pinData={pinData} 
                otherMapComponents={extraComponents} 
                center={{lng: Number(props.school.longitude),lat: Number(props.school.latitude)}} 
            />
        </>
    )
}

RoutePlannerMap.propTypes = {
    students: PropTypes.array,
    school: PropTypes.object,
    currentRoute: PropTypes.string,
    changeStudentRoute: PropTypes.func,
    studentChanges: PropTypes.object,
    allRoutes: PropTypes.array
}

RoutePlannerMap.defaultProps = {
    students: [],
    currentRoute: -1,
    studentChanges: {}
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(RoutePlannerMap)
