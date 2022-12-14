import React, {useState, useEffect, useRef} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Geocode from "react-geocode";
import { getIcon, SCHOOL_MARKER, STOP_MARKER, STUDENT_MARKER } from './static/markers';

const CLICK_FUNCTIONS = ["onClick", "onRightClick", "onMouseOver"]
const DRAG_FUNCTIONS = ["onDragEnd"]


function MapComponent(props) {
    const mapStyles = {        
        height: "60vh",
        width: "100%"};  
    //Geocode for location decoding
    //https://www.npmjs.com/package/react-geocode
    Geocode.setApiKey("AIzaSyDsyPs-pIVKGJiy7EVy8aKebN5zg515BCs");
    Geocode.setLanguage("en");
    Geocode.setRegion("us");
    Geocode.setLocationType("ROOFTOP");
    Geocode.enableDebug();

    const [pins, setPins] = useState([]);
    let pinInfo = [];

    const getSVGWithAnchor = (svg) => {
        const ret = {
            ...svg,
            anchor: new window.google.maps.Point(svg.anchor[0], svg.anchor[1])
        }
        return ret
    }

    const getColoredIcon = (color, icon) => {
        if(icon == null){
            return null;
        }
        return getSVGWithAnchor(getIcon(icon, color));
    }


    useEffect(() => {
        initializePins(props.pinData)
      }, [props.pinData]);



    
    const setClickFunc = (pinObj, position, markerInfo, propName) => {
        if(markerInfo[propName]){
            const tempFunc = markerInfo[propName];
            markerInfo[propName] = () => {tempFunc(pinObj, position)}
        }
    }
    
    const setPinClickFunctions = (pinObj, position, markerInfo) => {
        CLICK_FUNCTIONS.forEach(funcName => {
            setClickFunc(pinObj, position, markerInfo, funcName)
        })
    }

    const setDragFunc = (pinObj, markerInfo, propName) => {
        if(markerInfo[propName]){
            const tempFunc = markerInfo[propName];
            markerInfo[propName] = (e) => {tempFunc(pinObj, e)}
        }
    }

    const setPinDragFunctions = (pinObj, markerInfo) => {
        DRAG_FUNCTIONS.forEach(funcName => {
            setDragFunc(pinObj, markerInfo, funcName)
        })
    }




    const addMarkerFromPin = (lat, lng, pinGroup, pin) => {
        const temp = {
            position: {
                lat: lat,
                lng: lng
            },
            icon: getColoredIcon(pinGroup.iconColor, pinGroup.iconType),
            id: pin.id,
            ...pinGroup.markerProps
        }
        setPinClickFunctions(pin, {lat: lat, lng: lng}, temp)
        setPinDragFunctions(pin, temp);
        // console.log(temp.position)
        bounds.extend(new google.maps.LatLng(temp.position.lat, temp.position.lng));
        var lt = props.center.lat - (temp.position.lat-props.center.lat)
        while(lt>180){
            lt=lt-360
        }
        while(lt<-180){
            lt=lt+360
        }
        var ln = props.center.lng - (temp.position.lng-props.center.lng)
        while(ln>180){
            ln=ln-360
        }
        while(ln<-180){
            ln=ln+360
        }
        // console.log(lt,ln)
        bounds.extend(new google.maps.LatLng(lt, ln));
        pinInfo = pinInfo.concat(temp);
        setPins(pinInfo)
        // console.log(pins)
    }
    
    const initializePins = (inPinData) => {
        pinInfo = []
        setPins([])
        //console.log(inPinData)
        inPinData.forEach((pinGroup) => {
            pinGroup.pins.forEach((pin) => {
                //console.log(pin)
                if(pin.latitude == null || pin.longitude == null){
                    Geocode.fromAddress(pin.address)
                    .then((response) => {  
                        //console.log(response)
                        const { lat, lng } = response.results[0].geometry.location;
                        addMarkerFromPin(lat, lng, pinGroup, pin)
                    })
                    .catch(err => {}/*console.log(err)*/);
                }
                else {
                    // console.log("addmarker")
                    addMarkerFromPin(parseFloat(pin.latitude), parseFloat(pin.longitude), pinGroup, pin)
                }
                
            })
        });
        
    }

    var bounds = new google.maps.LatLngBounds();
    // const mapRef = useRef(null)
    const [z,setZ] = useState(21)
    const getMarkers = (inPins) => {
        var v = inPins.map((pin, pinInd) => {
            return <Marker {...pin} key={pinInd} />
        });
        return v;
    }

    const WORLD_DIM = { height: 256, width: 256 };
    const ZOOM_MAX = 21;

    const latRad = (lat) => {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    const zoom = (mapPx, worldPx, fraction) => {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    useEffect(()=>{
        var ne = bounds.getNorthEast();
        var sw = bounds.getSouthWest();   
        // console.log(ne.lat(), ne.lng(), sw.lat(),sw.lng())    
        var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;
        var lngDiff = ne.lng() - sw.lng();
        var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
        var latZoom = zoom(mapRef.current? mapRef.current.getDiv().clientHeight:427, WORLD_DIM.height, latFraction);
        var lngZoom = zoom(mapRef.current? mapRef.current.getDiv().clientWidth:517, WORLD_DIM.width, lngFraction);
        // console.log({latZoom, lngZoom, ZOOM_MAX},Math.min(latZoom, lngZoom, ZOOM_MAX))
        setZ( !isNaN(Math.min(latZoom, lngZoom, ZOOM_MAX))&&curZoom===0? Math.min(latZoom, lngZoom, ZOOM_MAX):z)
        // console.log(z)
    },[bounds])


    const mapRef = useRef(null);
    const handleLoad = (map)=>{
        // console.log(pos)
        mapRef.current=map;
    }
    const [pos, setPos]= useState({lat:0,lng:0})
    const [set,setSet] = useState(false)
    const [curZoom, setCurZoom]= useState(0)
    useEffect(()=>{
        // console.log(props.center)
        // console.log(set)
        if(props.center != null){
            if(props.center.lat == null || props.center.lng == null){
                Geocode.fromAddress(props.center.address)
                .then((response) => {  

                    setPos(response.results[0].geometry.location)
                })
                .catch(err => {}/*console.log(err)*/);
            }
            else{
                if(!set) setPos(props.center)
            }
        }
        else {

            if(!isNaN(props.center.lat) && !isNaN(props.center.lng) && pos.lng!==props.center.lng && !set){
                setPos(props.center)
                // setSet(true)
            }
        }
    },[props.center])

    const handleCenter = ()=>{
        if(!mapRef.current) return;
        const newPost = mapRef.current.getCenter().toJSON();
        if(pos.lat!==newPost.lat && pos.lng!==newPost.lng && !set){
            setPos(newPost)
            setSet(true)
        }
    }

    const handleZoom = ()=>{
        if(!mapRef.current) return;
        const newZoom = mapRef.current.getZoom();
        if(z!==newZoom){
            setCurZoom(newZoom)
            setZ(newZoom)
        }
    }


    
    return (
        <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={props.zoom ? props.zoom : z}
            center={pos}
            onLoad={handleLoad}
            onCenterChanged={handleCenter}
            onZoomChanged={handleZoom}
        >
            {/* <Spiderfy> */}
                {getMarkers(pins)}
                {props.otherMapComponents}
            {/* </Spiderfy> */}
            {/* {[0,1].map((pin, pinInd) => { return <Marker position={{lat: -33.847927 + pinInd,lng: 150.6517938}} key={"DF"}>
                <InfoWindow
                key={"pinInd"}
                visible={true}>
                <div>fahfhsdfhdsf</div>
            </InfoWindow>
            </Marker>})} */}
            
        </GoogleMap>
        )

}

MapComponent.propTypes = {
    pinData: PropTypes.arrayOf(
        PropTypes.shape({
            markerProps: PropTypes.object,
            pins: PropTypes.arrayOf(
                PropTypes.shape({
                        lng: PropTypes.number,
                        lat: PropTypes.number
                })
            )
        })
    ),
    onMapChange: PropTypes.func,
    zoom: PropTypes.number,
    center: PropTypes.shape({
        lng: PropTypes.number,
        lat: PropTypes.number
    }),
    otherMapComponents: PropTypes.element
}

MapComponent.defaultProps = {
    pinData: [],
    otherMapComponents: null,
    center: {
        //address: "52 Walters brook drive, bridgewater, nj"
        lat: 40.50590935646907,
        lng: -99.75547352324219
    },
}

const mapStateToProps = (state) => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(MapComponent)
