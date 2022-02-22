import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.setLocationType("ROOFTOP");
Geocode.enableDebug();

export const getItemCoord = (address, setAdd) => {
    Geocode.fromAddress(address).then(
        (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            // console.log({lat,lng})
            setAdd({ lat:lat, lng:lng })
            return({
                lat:lat, 
                lng:lng
            })
        },
        (error) => {
            console.log(error);
    });
  }



export const getDistance = (position1, position2) => {
    return getDistanceFromLatLonInMiles(position1.latitude, position1.longitude, position2.latitude, position2.longitude);
}

export function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d * 0.621371; // miles per km
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }



export const isStudentWithinRange = (student, stops) => {
    let ans = false;
    const studentLoc = {
        latitude: student.guardian.latitude,
        longitude: student.guardian.longitude,
    }
    stops.forEach(stop => {
        const dist = getDistance(studentLoc, stop)
        if(dist <= 0.3) {
            ans = true;
        }
    }) 
    return ans;
}

