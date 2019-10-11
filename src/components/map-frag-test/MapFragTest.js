import React, { Component, useState, useEffect, Fragment } from 'react';
import GoogleMapReact, { Circle, InfoWindowm, GoogleMap, Marker, Polygon, Rectangle, Map, GoogleApiWrapper, fitBounds, useLoadScript } from 'google-maps-react';
// import { fitBounds } from 'google-map-react/utils';

function MapFragTest(){

    const [mapRef, setMapRef] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [markerMap, setMarkerMap] = useState({});
    const [center, setCenter] = useState({ lat: 44.076613, lng: -98.362239833 });
    const [zoom, setZoom] = useState(5);
    const [clickedLatLng, setClickedLatLng] = useState(null);
    const [infoOpen, setInfoOpen] = useState(false);

    const myPlaces = [
        { id: "place1", pos: { lat: 39.09366509575983, lng: -94.58751660204751 } },
        { id: "place2", pos: { lat: 39.10894664788252, lng: -94.57926449532226 } },
        { id: "place3", pos: { lat: 39.07602397235644, lng: -94.5184089401211 } }
      ];

      const fitBounds = map => {
        const bounds = new window.google.maps.LatLngBounds();
        myPlaces.map(place => {
          bounds.extend(place.pos);
          return place.id;
        });
        map.fitBounds(bounds);
      };

      const loadHandler = map => {
        // Store a reference to the google map instance in state
        setMapRef(map);
        // Fit map bounds to contain all markers
        fitBounds(map);
      };
    
 


        //THis is where the fetch happens
        // const id = this.props.match.params.id;
    
        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        // const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${id}`;

        // useEffect(()=>{
        //             //need to set in the correct 
        // fetch(proxyUrl + targetUrl).then(resp=> resp.json())
        // .then(resp=>{
        //     console.log(resp);
        //     this.setState({
        //        game: resp
        //     });
        //     console.log(this.state.game);
            
        // }).catch(error=>{
        //     console.log(error);
            
        // })



        // }, []);




    

        const renderMap = () => {
            return (
              <Fragment>
                <GoogleMap
                  // Do stuff on map initial laod
                  onLoad={loadHandler}
                  // Save the current center position in state
                  onCenterChanged={() => setCenter(mapRef.getCenter().toJSON())}
                  // Save the user's map click position
                  onClick={e => setClickedLatLng(e.latLng.toJSON())}
                  center={center}
                  zoom={zoom}
                  mapContainerStyle={{
                    height: "70vh",
                    width: "100%"
                  }}
                >
                  {myPlaces.map(place => (
                    <Marker
                      key={place.id}
                      position={place.pos}
                      onLoad={marker => markerLoadHandler(marker, place)}
                      onClick={event => markerClickHandler(event, place)}
                      // Not required, but if you want a custom icon:
                      icon={{
                        path:
                          "M12.75 0l-2.25 2.25 2.25 2.25-5.25 6h-5.25l4.125 4.125-6.375 8.452v0.923h0.923l8.452-6.375 4.125 4.125v-5.25l6-5.25 2.25 2.25 2.25-2.25-11.25-11.25zM10.5 12.75l-1.5-1.5 5.25-5.25 1.5 1.5-5.25 5.25z",
                        fillColor: "#0000ff",
                        fillOpacity: 1.0,
                        strokeWeight: 0,
                        scale: 1.25
                      }}
                    />
                  ))}
        
                  {infoOpen && selectedPlace && (
                    <InfoWindow
                      anchor={markerMap[selectedPlace.id]}
                      onCloseClick={() => setInfoOpen(false)}
                    >
                      <div>
                        <h3>{selectedPlace.id}</h3>
                        <div>This is your info window content</div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
        
                {/* Our center position always in state */}
                <h3>
                  Center {center.lat}, {center.lng}
                </h3>
        
                {/* Position of the user's map click */}
                {clickedLatLng && (
                  <h3>
                    You clicked: {clickedLatLng.lat}, {clickedLatLng.lng}
                  </h3>
                )}
        
                {/* Position of the user's map click */}
                {selectedPlace && <h3>Selected Marker: {selectedPlace.id}</h3>}
              </Fragment>
            );
          };
        
          return isLoaded ? renderMap() : null;
}

export default GoogleApiWrapper({
  apiKey: 'YOUR API KEY HERE'
})(MapFragTest);