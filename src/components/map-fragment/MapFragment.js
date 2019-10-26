import React, { Component } from 'react';
import GoogleMapReact, { Circle, Marker, Polygon, Rectangle, Map, GoogleApiWrapper, fitBounds } from 'google-maps-react';
// import { fitBounds } from 'google-map-react/utils';
import styles from './MapFragment.module.css';
import backEndUrl from '../../backEndUrl';

class MapFragment extends Component{

    state = {
        game: {}
    }

    bounds = {
        nw: {
          lat: 50.01038826014866,
          lng: -118.6525866875
        },
        se: {
          lat: 32.698335045970396,
          lng: -92.0217273125
        }
      };
 


    componentDidMount(){

        const id = this.props.match.params.id;
    
        
        const targetUrl = backEndUrl + `${id}`;
            
        //need to set in the correct 
        fetch(targetUrl).then(resp=> resp.json())
        .then(resp=>{
            console.log(resp);
            this.setState({
               game: resp
            });
            console.log(this.state.game);
            
        }).catch(error=>{
            console.log(error);
            
        });
    }



    

    render (){
        return (
                    <GoogleMapReact

google={this.props.google}
zoom={10}
draggable={false}
options={{
    scrollwheel: false,
}}
streetViewControl={false}
// zoomControl={false}
fullscreenControl={false}
style={styles, {height: '400px', width: '400px'}}
initialCenter={{
 lat: 59.91130893949704,
 lng: 10.74973741557148
}}

yesIWantToUseGoogleMapApiInternals={true}
onGoogleApiLoaded={({map, maps}) =>
  new maps.Circle({
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.3,
    map,
    center: {lat: this.props.latitude, lng: this.props.longitude},
    radius: 275,
  })}
>   


    {/* <Rectangle
              strokeColor= {'#FF0000'}
              strokeOpacity= {0.8}
              strokeWeight={2}
              fillColor= {'#FF0000'}
              fillOpacity= {0.35}
            //   map= {map}
              bounds= {{
                north: 59.885,
                south: 59.6,
                east: 10.734,
                west: 10.751
              }} /> */}

    {/* <Rectangle /> */}

</GoogleMapReact>


        )
    }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDK8rGpE1KhjWqW8L3R9m6XeQTnxUMgdBQ'
})(MapFragment);