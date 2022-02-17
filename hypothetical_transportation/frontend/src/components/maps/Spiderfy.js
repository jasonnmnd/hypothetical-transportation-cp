import React from "react";
import { GoogleMap } from "@react-google-maps/api";

class Spiderfy extends React.Component {
  constructor(props) {
    super(props);
    const oms = require(`npm-overlapping-marker-spiderfier/lib/oms.min`);

    this.oms = new oms.OverlappingMarkerSpiderfier(
      GoogleMap().MapContext._currentValue, // 1*
      {}
    );

    this.markerNodeMounted = this.markerNodeMounted.bind(this);
  }

  async markerNodeMounted(ref) {
    setTimeout(() => { //3*
      this.oms.addMarker(ref.marker); // 2*
      window.google.maps.event.addListener(ref.marker, "spider_click", e => {
        if (this.props.onSpiderClick) this.props.onSpiderClick(e);
      });
    }, 2000);
  }

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, { ref: this.markerNodeMounted })
    );
  }
}

export default Spiderfy;


// note 
// 1*
// if your are not able to get thecontext of google map then you can use MapContext._currentValue 
// and import it instead of Google map i.e ( import { MapContext } from "@react-google-maps/api"; )

// 2*
// if you are not able to get the value with ref.marker then it can be ref.state.marker

// 3* 
// I am using setTimeout as a hack it could be more better but FYI if marker took time to load and you are have trouble with // // markers refs then you can use setTimeout !!! but its not an ideal solution but it works