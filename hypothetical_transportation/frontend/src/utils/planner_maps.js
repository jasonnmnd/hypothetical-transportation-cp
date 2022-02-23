
import { NO_ROUTE } from "./utils"

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