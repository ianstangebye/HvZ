import React, { Component } from 'react';
import GoogleMapReact, { Circle, Marker, Polygon, Rectangle, Map, GoogleApiWrapper, fitBounds } from 'google-maps-react';
// import { fitBounds } from 'google-map-react/utils';

class MapFragTest extends Component{

    state = {
        game: {}
    }


 


    componentDidMount(){

        const id = this.props.match.params.id;
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${id}`;
            
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
style={{height: '400px', width: '400px'}}
initialCenter={{
 lat: 59.91130893949704,
 lng: 10.74973741557148
}}
/>


        )
    }
}

export default GoogleApiWrapper({
  apiKey: 'YOUR API KEY HERE'
})(MapFragTest);