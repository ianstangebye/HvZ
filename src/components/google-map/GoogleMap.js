import React from 'react';
import styles from './GoogleMap.module.css';


class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        this.mapEl = React.createRef();
        this.state = {
            game: {}
        }
    }


    renderMap() {
        // console.log("SHOW A FANCY MAP")

        const map = new window.google.maps.Map(this.mapEl.current, 
        //     {
        //     center: {
        //         lat: 59.931284, lng: 10.683881
        //     },
        //     zoom: 12
        // }
        );

        const rectangle = new window.google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            bounds: {
                north: this.state.game.nw_Lat,
                south: this.state.game.se_Lat,
                east: this.state.game.se_Lng,
                west: this.state.game.nw_Lng
            }
        });

        const image = {
            url: 'https://icon-library.net/images/gravestone-icon/gravestone-icon-4.jpg',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0,0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
          };


        var beaches = [
            ['Bondi Beach', this.state.game.nw_Lat, this.state.game.nw_Lng, 4],
        ];  

        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };

        for (var i = 0; i < beaches.length; i++) {
            var beach = beaches[i];
            var marker = new window.google.maps.Marker({
              position: {lat: beach[1], lng: beach[2]},
              map: map,
              icon: image,
              shape: shape,
              title: beach[0],
              zIndex: beach[3]
            });
          }

        const sw = new window.google.maps.LatLng(this.state.game.se_Lat, this.state.game.nw_Lng);
        const ne = new window.google.maps.LatLng(this.state.game.nw_Lat, this.state.game.se_Lng);
        let bounds = new window.google.maps.LatLngBounds(sw, ne);
        map.fitBounds(bounds);
    }

    async componentDidMount() {
        const id = this.props.match.params.id;
    
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${id}`;
            
        //need to set in the correct 
        await fetch(proxyUrl + targetUrl).then(resp=> resp.json())
        .then(resp=>{
            // console.log(resp);
            this.setState({
               game: resp
            });
            console.log(this.state.game.nw_Lng);
            
        }).catch(error=>{
            console.log(error);
            
        });

        this.renderMap();
    }

    render() {
        return (
            <React.Fragment>
                <div id="map" ref={this.mapEl} className={styles.Map}>
                </div>
            </React.Fragment>
            
        )
    }
}

export  default GoogleMap;