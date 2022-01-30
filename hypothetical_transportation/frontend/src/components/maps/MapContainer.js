import React, {useState, useEffect} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";
import PinImage from "./pin.png";
import PinImage2 from "./pin1.png";

function MapContainer(props) {
    const mapStyles = {        
        height: "50vh",
        width: "50%"};
    
    //Geocode for location decoding
    //https://www.npmjs.com/package/react-geocode
    Geocode.setApiKey("AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58");
    Geocode.setLanguage("en");
    Geocode.setRegion("us");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();
    const iconBase =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/";


    //Center at school
    const defaultCenter = {
      lat: 36.0016944, lng: -78.9480547
    }

    const [schoolAdd, setSchoolAdd] = useState({});
    let studentAddress = [];
    const [studentAdd, setStudentAdd] = useState([]);
    let routeAddress = [];
    const [routeAdd, setRouteAdd] = useState([]);

    const getSchoolCoord = (school) => {
      Geocode.fromAddress(school.address).then(
          (response) => {
              // console.log(response.results[0].geometry.location);
              const { lat, lng } = response.results[0].geometry.location;
              setSchoolAdd({
                info_text: school.name,
                location: {
                  lat:lat, 
                  lng:lng
                }
              })
          },
          (error) => {
              console.log(error);
      });
    }

    const getStudentCoord = (stu) => {
      Geocode.fromAddress(stu.address).then(
          (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              studentAddress = studentAddress.concat({
                info_text: stu.full_name,
                location: {
                  lat:lat, 
                  lng:lng
                }
              })
              setStudentAdd(studentAddress)
          },
          (error) => {
              console.log(error);
      });
    }

    const getRouteStudentCoord = (stu) => {
      Geocode.fromAddress(stu.address).then(
          (response) => {
              const { lat, lng } = response.results[0].geometry.location;
              routeAddress = routeAddress.concat({
                info_text: stu.full_name,
                location: {
                  lat:lat, 
                  lng:lng
                }
              })
              setRouteAdd(routeAddress)
          },
          (error) => {
              console.log(error);
      });
    }


    useEffect(() => {
      console.log(props.studentData)
      console.log(props.routeStudentData)
      getSchoolCoord(props.schoolData);
      props.studentData.map(stu=>{
        getStudentCoord(stu)
      })
      if(props.routeStudentData!==null && props.routeStudentData!==undefined){
        props.routeStudentData.map(stu=>{
          getRouteStudentCoord(stu)
        })
      }
    }, [props]);

  const [selected, setSelected] = useState({});

  const onSelect = loc => {
    setSelected(loc)
    // console.log(props.studentData);
    // console.log(props.schoolData);
  }

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58'>
       <GoogleMap
         mapContainerStyle={mapStyles}
         zoom={13}
         center={schoolAdd.location}>

         <Marker key={schoolAdd.info_text} position={schoolAdd.location} onClick={() => onSelect(schoolAdd)} options={{icon:`${PinImage}`}}></Marker>
         {
           studentAdd.map((stu,i)=>{
            return (<Marker key={stu.info_text} position={stu.location} onClick={() => onSelect(stu)}></Marker>)
            })
         }
         {
           routeAdd.map((stu,i)=>{
            return (<Marker key={stu.info_text} position={stu.location} onClick={() => onSelect(stu)} options={{icon:`${PinImage2}`}}></Marker>)
            })
         }

         {
           selected.location && 
           (
             <InfoWindow
             position={selected.location}
             clickable={true}
             onCloseClick={()=>setSelected({})}
             >
               <p>{selected.info_text}</p>
             </InfoWindow>
           )
         }

       </GoogleMap>
    </LoadScript>
 );
}

MapContainer.propTypes = {
    studentData: PropTypes.array,
    routeStudentData: PropTypes.array,
    schoolData: PropTypes.object
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(MapContainer)
