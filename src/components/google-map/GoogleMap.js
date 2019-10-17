import React from 'react';
import styles from './GoogleMap.module.css';
import { array } from 'prop-types';


class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        this.renderMap = this.renderMap.bind(this);
        this.mapEl = React.createRef();
        this.state = {
            game: {}
        }
    }


    async renderMap() {
        // console.log("SHOW A FANCY MAP")

        const map = new window.google.maps.Map(this.mapEl.current, 
            {
                streetViewControl: false
            }
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
            url: 'https://image.flaticon.com/icons/png/512/1233/1233009.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0,0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
          };


        var beaches = [
            ['Player 1 had their limbs torn off', this.state.game.nw_Lat, this.state.game.nw_Lng, 4],
        ];  

        const id = this.props.game_id;
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${id}/kill`;
        

        await fetch(targetUrl).then(resp=> resp.json())
        .then(resp=>{
            console.log(resp);
            for(i=0;i<resp.length; i++){
                beaches[i+1] = new Array('Player ' + resp[i].victim_Id + ' ' +resp[i].story, resp[i].lat, resp[i].lng)
            }
        });
        // .then((data)=>{
        //     console.log(data.results);
            
        //     // for(var i=1; i<data.length;i++){
        //     //     // beaches[i] = new Array()
        //     //     console.log(data.results[i]);
                
        //     // }

        // })

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
        const id = this.props.game_id;
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${id}`;
            
        //need to set in the correct 
        await fetch(targetUrl).then(resp=> resp.json())
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
            <React.Fragment /*loadMap={this.renderMap}*/>
                <div className={styles.MapDiv}>
                    <div id="map" ref={this.mapEl} className={styles.Map}>
                    </div>
                </div>
            </React.Fragment>
            
        )
    }
}

export  default GoogleMap;