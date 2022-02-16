


export const addSchoolPin = (pinData, school, onSchoolClick) => {
    pinData.push({
        iconColor: "black",
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