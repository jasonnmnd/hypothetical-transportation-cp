import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyA6nIh9bWUWFOD_y7hEZ7UQh_KmPn5Sq58");
Geocode.setLanguage("en");
Geocode.setRegion("us");
Geocode.setLocationType("ROOFTOP");
Geocode.enableDebug();

export const getItemCoord = (address) => {
    Geocode.fromAddress(address).then(
        (response) => {
            const { lat, lng } = response.results[0].geometry.location;
            return({
              info_text: address,
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


