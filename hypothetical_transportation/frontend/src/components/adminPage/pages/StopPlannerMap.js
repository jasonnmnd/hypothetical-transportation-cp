import React, { useState, useEffect } from 'react';
import {InfoWindow} from '@react-google-maps/api';
import { connect } from 'react-redux';
import MapComponent from "../../maps/MapComponent";
import PropTypes, { string } from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { NO_ROUTE } from '../../../utils/utils';
import { getStudentPin, addSchoolPin, getStopPin } from '../../../utils/planner_maps';




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
        createInfoWindow(position, <h1>{pinStuff.name}</h1>)
    }

    const onStopClick = (pinStuff, position) => {
        createInfoWindow(position, <h1>{pinStuff.stop_number}</h1>)
    }

    useEffect(() => {
        console.log(props.stops)
       setPinData(getPinData())
    }, [props]);

    

    

    const getStudentsWStop = () => {
        return props.students.filter(student => student.has_inrange_stop == true);
    }

    const getStudentsWOStop = () => {
        return props.students.filter(student => !student.has_inrange_stop);
    }


    const getStudentGroupsPinData = () => {
        
        return [
            {
                iconColor: "green",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick,
                },
                pins: getStudentsWStop().map(student => {return getStudentPin(student)})
            },
            {
                iconColor: "red",
                iconType: "student",
                markerProps: {
                    onClick: onStudentClick,
                },
                pins: getStudentsWOStop().map(student => {return getStudentPin(student)})
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
                    onDragEnd: props.onStopDragEnd
                },
                pins: props.stops.map(stop => getStopPin(stop))
            },
        ]
    }
    
    const getPinData = () => {
        let pinData = getStudentGroupsPinData();
        pinData = pinData.concat(getStopPinData());
        addSchoolPin(pinData, props.school, onSchoolClick)
        return pinData;
    }


    return <MapComponent pinData={pinData} otherMapComponents={extraComponents} />
}

StopPlannerMap.propTypes = {
    students: PropTypes.array,
    school: PropTypes.object,
    stops: PropTypes.array,
    onStopDragEnd: PropTypes.func,
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
