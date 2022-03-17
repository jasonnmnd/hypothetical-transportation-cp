import React, { useState, useEffect } from 'react';
import {InfoWindow} from '@react-google-maps/api';
import { connect } from 'react-redux';
import MapComponent from "./MapComponent";
import PropTypes, { string } from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { NO_ROUTE } from '../../utils/utils';
import { getStudentPin, addSchoolPin, getStopPin } from '../../utils/planner_maps';





function StopPlannerMap(props){

    const [pinData, setPinData] = useState([]);

    const [extraComponents, setExtraComponents] = useState(null);

    const createInfoWindow = (position, windowComponents) => {
        setExtraComponents(<InfoWindow position={position} onCloseClick={setExtraComponents(null)}>{windowComponents}</InfoWindow>)
    }

    const onStudentClick = (pinStuff, position) => {
        createInfoWindow(position, <h4>{pinStuff.full_name}</h4>)
    }

    const onSchoolClick = (pinStuff, position) => {
        createInfoWindow(position, <h4>{pinStuff.name}</h4>)
    }

    const onStopClick = (pinStuff, position) => {
        createInfoWindow(position, <h4>{pinStuff.name}</h4>)
    }

    useEffect(() => {
        // console.log(props.stops)
       setPinData(getPinData())
    }, [props]);

    

    

    const getStudentsWStop = () => {
        return props.students.filter(student => student.has_inrange_stop == true);
    }

    const getStudentsWOStop = () => {
        return props.students.filter(student => !student.has_inrange_stop);
    }

    const getStudentInfoWindow = (pinStuff) => {
        return <InfoWindow key={`student-${pinStuff.id}`}></InfoWindow>
    }


    const getStudentGroupsPinData = () => {

        const studentsWStop = getStudentsWStop();
        const studentsWOStop = getStudentsWOStop();

        props.setComplete(studentsWOStop.length == 0);
        
        return [
            {
                iconColor: "green",
                iconType: "studentCheck",
                markerProps: {
                    onClick: onStudentClick,
                    onRightClick: onStudentClick,
                },
                pins: studentsWStop.map(student => {return getStudentPin(student)})
            },
            {
                iconColor: "red",
                iconType: "studentX",
                markerProps: {
                    onClick: onStudentClick,
                    onRightClick: onStudentClick,
                },
                pins: studentsWOStop.map(student => {return getStudentPin(student)})
            },
        ]
    }

    const getStopPinData = () => {
        return [
            {
                iconColor: "blue",
                iconType: "stop",
                markerProps: {
                    onClick: onStopClick,
                    draggable: true,
                    onDragEnd: props.onStopDragEnd,
                    onRightClick: props.deleteStop
                },
                pins: props.stops.map(stop => getStopPin(stop))
            },
        ]
    }
    
    const getPinData = () => {
        let pinData = getStudentGroupsPinData();
        addSchoolPin(pinData, props.school, onSchoolClick)
        pinData = pinData.concat(getStopPinData());
        return pinData;
    }


    return <MapComponent pinData={pinData} otherMapComponents={extraComponents} center={{lng: Number(props.school.longitude),lat: Number(props.school.latitude)}}/>
}

StopPlannerMap.propTypes = {
    students: PropTypes.array,
    school: PropTypes.object,
    stops: PropTypes.array,
    onStopDragEnd: PropTypes.func,
    deleteStop: PropTypes.func,
    setComplete: PropTypes.func
}

// StopPlannerMap.defaultProps = {
//     students: [],
//     stops: [],
// }


StopPlannerMap.defaultProps = {
    school: {},
    students: [],
    // stops: [
    //     {
    //         address: "68 Walters Brook Drive, Bridgewater, NJ"
    //     },
    //     {
    //         address: "90 Walters Brook Drive, Bridgewater, NJ"
    //     }
    // ],
}

const mapStateToProps = (state) => ({
});
  


export default connect(mapStateToProps)(StopPlannerMap)