
import { InfoWindow } from "@react-google-maps/api";
import React from 'react';
import { getDistance } from "./geocode"
import { NO_ROUTE } from "./utils"

const MARKER_OVERLAP_DISTANCE = 0.01; //miles

export const addSchoolPin = (pinData, school, onSchoolClick) => {
    pinData.push({
        iconColor: "white",
        iconType: "school",
        markerProps: {
            onClick: onSchoolClick
        },
        pins: [
            school
        ]
    })
}

export const getStudentPin = (student) => {
    return {
        ...student, 
        address: student.guardian.address, 
        latitude: student.guardian.latitude, 
        longitude: student.guardian.longitude
    }
}

export const getStopPin = (stop) => {
    return {
        ...stop, 
    }
}

export const getCurRouteFromStudent = (student, studentChanges) => {
    if(studentChanges[student.id] != null){
        if(studentChanges[student.id] == NO_ROUTE){
            return null;
        }
        return studentChanges[student.id];
    }
    if(student.routes == null){
        return null;
    }
    return student.routes.id;
}

export const getStudentRouteName = (studentId, studentRouteObj, studentChanges, allRoutes) => {
    const routeId = studentChanges[studentId];
    let routeName = '';
    if(routeId == null){
        if(studentRouteObj == null){
            routeName = "NO ROUTE"
        } else {
            routeName = studentRouteObj.name
        }
    } else if(routeId == NO_ROUTE) {
        routeName = "NO ROUTE";
    } else {
        routeName = allRoutes.find(route => route.id == routeId).name
        //should never be undefined
    }
    return routeName;
}

export const compareStopLists = (stops1, stops2) => {
    if(stops1.length != stops2.length){
        return false;
    }

    return stops1.every(stop1 => {
        const stop2 = stops2.find(stop => stop1.id == stop.id);
        return stop2 != undefined && stop1.name == stop2.name && stop1.location == stop2.location && stop1.stop_number == stop2.stop_number
    })
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

export const getMarkerOverlaps = (studentsArr) => {
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

export const createInfoWindow = (position, windowComponents, setExtraComponents) => {
    setExtraComponents(<InfoWindow position={position} onCloseClick={setExtraComponents(null)}>{windowComponents}</InfoWindow>)
}

