import React from 'react';
import styles from './GoogleMap.module.css';
import { array } from 'prop-types';


class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        this.renderMap = this.renderMap.bind(this);
        this.mapEl = React.createRef();
        this.state = {
            game: {},
            missions: []
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

        const missionImage = {
            url: 'https://www.searchpng.com/wp-content/uploads/2018/12/mgpl.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0,0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
          };

          
        const zombieMissionImage = {
            url: 'https://cdn4.iconfinder.com/data/icons/zombie-2/512/as_1078-512.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0,0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
          };

                    
        const humanMissionImage = {
            url: 'https://www.trzcacak.rs/myfile/full/102-1024387_vector-icon-of-clenched-fist-on-shield-fist.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0,0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
          };


        var beaches = [
            ['Player 1 had their limbs torn off', this.state.game.nw_Lat, this.state.game.nw_Lng, 4],
        ];  

        const id = this.props.game_id;
        const player_status = this.props.player.is_Human;
        
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

        const missionsURL = `http://case-hvzapi.northeurope.azurecontainer.io/game/${id}/mission/`

        await fetch(missionsURL).then(resp=>resp.json())
        .then(resp=>{
            console.log(resp);
            this.setState({
                missions: [...resp]
            });
            console.log(this.state.missions);
           
        }).catch(error=>{
            console.log(error);
            
        });



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
              zIndex: 4
            });
          }

        for (var i=0; i<this.state.missions.length; i++){
            var mission = this.state.missions[i];

            var rightNow = new Date();
            // console.log(rightNow);
            var missionDeadline = new Date(mission.end_Time)
            console.log(missionDeadline);

            var contentString = `<div id="content">
                                <h1 style="color:black;padding:0;margin:0;">${mission.name}</h1>
                                <hr>
                                <p style="color:black;top-padding:0;">${mission.description}</p>
                              
                                <b style="color:black;padding:2px;">Mission Deadline: ${mission.end_Time}</b>
                                </div>`;

            if(rightNow < missionDeadline){
                
                if(mission.is_Human_Visible && mission.is_Zombie_Visible){
                    var globalMarker = new window.google.maps.Marker({
                        position: {lat: mission.latitude, lng: mission.longitude},
                        map: map,
                        icon: missionImage,
                        shape: shape,
                        title: mission.name,
                        zIndex: 4
                      });
                      var infowindow = new window.google.maps.InfoWindow({
                        content: contentString
                      });
                      globalMarker.addListener('click', function() {
                        infowindow.open(map, globalMarker);
                      });
                } else if(mission.is_Human_Visible == false && player_status == false){
                    var zombieMarker = new window.google.maps.Marker({
                        position: {lat: mission.latitude, lng: mission.longitude},
                        map: map,
                        icon: zombieMissionImage,
                        shape: shape,
                        title: mission.name,
                        zIndex: 4
                      });
                      var infowindow = new window.google.maps.InfoWindow({
                        content: contentString
                      });
                      zombieMarker.addListener('click', function() {
                        infowindow.open(map, zombieMarker);
                      });
                } else if(mission.is_Human_Visible == true && player_status == true){
                    var humanMarker = new window.google.maps.Marker({
                        position: {lat: mission.latitude, lng: mission.longitude},
                        map: map,
                        icon: humanMissionImage,
                        shape: shape,
                        title: mission.name,
                        zIndex: 4
                      });
                      var infowindow = new window.google.maps.InfoWindow({
                        content: contentString
                      });
                      humanMarker.addListener('click', function() {
                        infowindow.open(map, humanMarker);
                      });
    
                } else {
                    console.log('Player' + this.props.player.player_Id + 'status is ' + player_status + '. The user_Id is ' + this.props.player.user_Id);
                    
                }

            } else {
                
                console.log(rightNow < missionDeadline);
                console.log('mission expired');
                
            }      


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