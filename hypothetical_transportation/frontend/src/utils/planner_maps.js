
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