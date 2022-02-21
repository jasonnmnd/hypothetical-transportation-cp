import MapComponent from "./MapComponent";
import React, { useState } from 'react';
import {InfoWindow} from '@react-google-maps/api';




const school = {
    id: 2,
    name: "Fake Univeristy",
    address: "202 Watts Street, Durham, NC"
}

const students = [
    {
      id: 2,
      school: {
        id: 1,
        name: 'St. John\'s University',
        address: 'Sydney, Australia, Earth'
      },
      routes: null,
      guardian: {
        id: 3,
        email: 'fred@thecat.com',
        full_name: 'Fred TheCat',
        address: '311 Research Drive, Durham, NC',
        groups: [
          {
            id: 1,
            name: 'Administrator'
          }
        ]
      },
      full_name: 'Chidi Anagonye',
      active: true,
      student_id: 2
    },
    {
      id: 3,
      school: {
        id: 1,
        name: 'St. John\'s University',
        address: 'Sydney, Australia, Earth'
      },
      routes: {
        id: 2,
        name: 'The Door to Earth',
        description: 'The Door to Earth',
        school: 1
      },
      guardian: {
        id: 17,
        email: 'mmilan@mmilan.com',
        full_name: 'Milan',
        address: '2638 Erwin Rd, durham, nc',
        groups: [
          {
            id: 1,
            name: 'Administrator'
          }
        ]
      },
      full_name: 'Jason Mendoza',
      active: true,
      student_id: 3
    },
    {
      id: 4,
      school: {
        id: 1,
        name: 'St. John\'s University',
        address: 'Sydney, Australia, Earth'
      },
      routes: {
        id: 1,
        name: 'The Trans Eternal Railway',
        description: 'Connects Neighborhood 12358W to other locations in the afterlife.',
        school: 1
      },
      guardian: {
        id: 1,
        email: 'michael@gmail.com',
        full_name: 'Michaele',
        address: '500 West Main Street, Durham, NC',
        groups: [
          {
            id: 2,
            name: 'Guardian'
          }
        ]
      },
      full_name: 'Tahani Al-Jamil',
      active: true,
      student_id: 4
    },
    {
      id: 16,
      school: {
        id: 1,
        name: 'St. John\'s University',
        address: 'Sydney, Australia, Earth'
      },
      routes: {
        id: 1,
        name: 'The Trans Eternal Railway',
        description: 'Connects Neighborhood 12358W to other locations in the afterlife.',
        school: 1
      },
      guardian: {
        id: 4,
        email: 'max@thedog.com',
        full_name: 'Max TheDog',
        address: '2211 Hillsborough Rd, durham, nc',
        groups: [
          {
            id: 2,
            name: 'Guardian'
          }
        ]
      },
      full_name: 'fsadf',
      active: true,
      student_id: 144
    }
  ]


const getStudentsWORoute = () => {
    return students.filter(student => student.routes == null);
}

const getStudentsWRoute = () => {
    return students.filter(student => student.routes != null);
}


const stop1 = {
    id: 1,
    name: "STOP ALPHA",
    address: "2699 West Knox Street, Durham, NC"
}

const stop2 = {
    id: 2,
    name: "STOP BETA",
    address: "714 Ninth Street, Durham, NC"
}



const getInfoWindow = () => {
    return <InfoWindow position={{lat: 36.0016944, lng: -78.9480547}}><h1>HELLOOOO</h1></InfoWindow>
}


function ExampleMapUsage(){
    const [comps, setComps] = useState(null);
    const onSchoolClick = (pinStuff, position) => {
        console.log(pinStuff);
        console.log(position);
        setComps(<InfoWindow position={position} onCloseClick={setComps(null)}><h1>{pinStuff.name}</h1></InfoWindow>)
    }

    const pinData = [
        {
            iconColor: "green",
            iconType: "studentCheck",
            markerProps: {
                draggable: true
            },
            pins: getStudentsWRoute().map(student => {return {address: student.guardian.address, id: student.id}})
        },
        {
            iconColor: "red",
            iconType: "studentX",
            markerProps: {
                draggable: false
            },
            pins: getStudentsWORoute().map(student => {return {address: student.guardian.address, id: student.id}})
        },
        {
            iconColor: "black",
            iconType: "school",
            markerProps: {
                draggable: false,
                onDblClick: onSchoolClick
            },
            pins: [
                school
            ]
        },
        {
            iconColor: "orange",
            iconType: "stop",
            markerProps: {
                draggable: false
            },
            pins: [
                stop1,
                stop2
            ]
        },
    ]
    
    return <MapComponent pinData={pinData} otherMapComponents={comps}/>
}

export default ExampleMapUsage;