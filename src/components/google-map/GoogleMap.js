import React from 'react';
import styles from './GoogleMap.module.css';
import { array } from 'prop-types';
import { stringify } from 'querystring';
import MissionList from '../mission-list/MissionList';
import backEndUrl from '../../backEndUrl';

function internalDoSomething(text){
    // console.log(text);
    
}


class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        this.renderMap = this.renderMap.bind(this);
        this.mapEl = React.createRef();
        this.state = {
            game: {},
            missions: [],
            checkins: [],
            userInfo: props.userInfo
        }
        this.map = null;
        this.locationImage = null;
        this.positionMarker = null;
    }

    // doSomething (event) {
    //     // // console.log(event.data.param1);
        
    //     // // console.log('Youre killing it, specifically ' + event.data.param1);
    //     // console.log('youre killing it twice as much');
        
        
    // }


    renderMap = async () => {
        // // console.log("SHOW A FANCY MAP")

        this.map = new window.google.maps.Map(this.mapEl.current,
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

        this.locationImage = {
            url: 'https://media.giphy.com/media/WpTLELKe3tOJLWl6FG/giphy.gif',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(50 , 50), // scaled size
            origin: new window.google.maps.Point(0, 0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
        };

        this.positionMarker = new window.google.maps.Marker({
            position: { lat: 59.914691, lng: 10.750862 },
            map: this.map,
            icon: this.locationImage,
            title: 'Your current position',
            zIndex: 6
        });

        const rectangle = new window.google.maps.Rectangle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: this.map,
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
            origin: new window.google.maps.Point(0, 0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
        };

        const missionImage = {
            url: 'https://www.searchpng.com/wp-content/uploads/2018/12/mgpl.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0, 0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
        };


        const zombieMissionImage = {
            url: 'https://cdn4.iconfinder.com/data/icons/zombie-2/512/as_1078-512.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0, 0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
        };


        const humanMissionImage = {
            url: 'https://www.trzcacak.rs/myfile/full/102-1024387_vector-icon-of-clenched-fist-on-shield-fist.png',
            // This marker is 20 pixels wide by 32 pixels high.
            scaledSize: new window.google.maps.Size(35, 35), // scaled size
            origin: new window.google.maps.Point(0, 0), // origin
            anchor: new window.google.maps.Point(15, 0) // anchor
        };

        //this is actually the bite entries
        var beaches = [
            ['Player 1 had their limbs torn off', -1000, -1000, -10000],
        ];

        var biteWindows =[];

        const id = this.props.game_id;
        const player_status = this.props.player.is_Human;

        const targetUrl = backEndUrl + `${id}/kill`;


        await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json())
            .then(resp => {
                // console.log(resp);
                for (i = 0; i < resp.length; i++) {
                    beaches[i + 1] = new Array('Player ' + resp[i].victim_Id + ' ' + resp[i].story, resp[i].lat, resp[i].lng, resp[i].kill_Id)
                }
            });
            

        const missionsURL = backEndUrl + `${id}/mission/`

        await fetch(missionsURL, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json())
            .then(resp => {
                // console.log(resp);
                this.setState({
                    missions: [...resp]
                });
                // console.log(this.state.missions);

            }).catch(error => {
                // console.log(error);

            });



        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
        };

        //zombie bite windows
        for (var i = 0; i < beaches.length; i++) {
            
            var beach = beaches[i];
            var contentBite;

            if(this.props.userInfo.is_admin){
                // console.log("trying to get the bitcontent set");
                contentBite = `<div id="content">
                <h4 style="color:black;padding:0;margin:0;">${beach[0]}</h4>
                <hr>
                <p style="color:black;top-padding:0;">lat: ${beach[1]}, lng: ${beach[2]}</p>
                <button type="button" onClick="(async function(){
                    const missionsURL = ${backEndUrl} + '${id}/kill/${beach[3]}';
                    // console.log(missionsURL);
                    await fetch(missionsURL, {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + '${this.state.userInfo.token}'
                    }
                    }).then(resp => resp.json())
                    .then(resp => {
                    // console.log(resp);
                    // console.log('its deleted');

                    }).catch(error => {
                    // console.log(error);

                    });

                    document.getElementById('HiddenButton').click();

                                    })()">Delete kill</button>
                                    </div>`;
                
            } else {
                contentBite = `<div id="content">
                <h4 style="color:black;padding:0;margin:0;">${beach[0]}</h4>
                <hr>
                <p style="color:black;top-padding:0;">lat: ${beach[1]}, lng: ${beach[2]}</p></div>`;
            }

            var marker = new window.google.maps.Marker({
                position: { lat: beach[1], lng: beach[2] },
                map: this.map,
                icon: image,
                shape: shape,
                title: beach[0],
                zIndex: 4
            });

            var infowindow = new window.google.maps.InfoWindow({
                content: contentBite
            });
            biteWindows.push({ "title": beach[0], "info": infowindow });
            marker.addListener('click', function () {                        
                for(var i = 0; i < biteWindows.length; i++) {
                    if(biteWindows[i].title == this.title) {
                        biteWindows[i].info.open(this.map, this);
                    }
                }
            });
        }

        const infoWindows = [];
        let idx = 0;

        for (var i = 0; i < this.state.missions.length; i++) {
            var mission = this.state.missions[i];

            var rightNow = new Date();
            // // console.log(rightNow);
            var missionDeadline = new Date(mission.end_Time)
            // console.log(missionDeadline);
            var missionStartTime = new Date(mission.start_Time);
            var contentString;

            if(this.props.userInfo.is_admin){
                // console.log("i is admin");
                contentString = `<div id="content">
                <h1 style="color:black;padding:0;margin:0;">${mission.mission_Id}: ${mission.name}</h1>
                <hr>
                <p style="color:black;top-padding:0;">${mission.description}</p>
              
                <b style="color:black;padding:2px;">Mission Deadline: ${mission.end_Time}</b>
                <button type="button" onClick="(async function(){
                    const missionsURL = ${backEndUrl} + '${id}/mission/${mission.mission_Id}';
                    // console.log(missionsURL);
await fetch(missionsURL, {
method: 'DELETE',
headers: {
'Content-Type': 'application/json',
'Authorization': 'Bearer ' + '${this.state.userInfo.token}'
}
}).then(resp => resp.json())
.then(resp => {
// console.log(resp);
// console.log('its deleted');

}).catch(error => {
// console.log(error);

});

document.getElementById('HiddenButton').click();

                })()">Delete Mission</button>
                </div>`;
                
            } else {
                contentString = `<div id="content">
                <h1 style="color:black;padding:0;margin:0;">${mission.mission_Id}: ${mission.name}</h1>
                <hr>
                <p style="color:black;top-padding:0;">${mission.description}</p>
              
                <b style="color:black;padding:2px;">Mission Deadline: ${mission.end_Time}</b>`;
            }


            if (rightNow > missionStartTime && rightNow < missionDeadline) {

                if (mission.is_Human_Visible && mission.is_Zombie_Visible) {
                    var globalMarker = new window.google.maps.Marker({
                        position: { lat: mission.latitude, lng: mission.longitude },
                        map: this.map,
                        icon: missionImage,
                        shape: shape,
                        title: mission.name,
                        zIndex: 4
                    });
                    var infowindow = new window.google.maps.InfoWindow({
                        content: contentString
                    });
                    infoWindows.push({ "title": mission.name, "info": infowindow });
                    globalMarker.addListener('click', function () {                        
                        for(var i = 0; i < infoWindows.length; i++) {
                            if(infoWindows[i].title == this.title) {
                                infoWindows[i].info.open(this.map, this);
                            }
                        }
                    });
                } else if (mission.is_Human_Visible == false && (player_status == false || this.state.userInfo.is_admin)) {
                    var zombieMarker = new window.google.maps.Marker({
                        position: { lat: mission.latitude, lng: mission.longitude },
                        map: this.map,
                        icon: zombieMissionImage,
                        shape: shape,
                        title: mission.name,
                        zIndex: 4
                    });
                    var infowindow = new window.google.maps.InfoWindow({
                        content: contentString
                    });
                    infoWindows.push({ "title": mission.name, "info": infowindow });
                    zombieMarker.addListener('click', function () {                        
                        for(var i = 0; i < infoWindows.length; i++) {
                            if(infoWindows[i].title == this.title) {
                                infoWindows[i].info.open(this.map, this);
                            }
                        }
                    });
                } else if (mission.is_Human_Visible == true && (player_status == true || this.state.userInfo.is_admin)) {
                    var humanMarker = new window.google.maps.Marker({
                        position: { lat: mission.latitude, lng: mission.longitude },
                        map: this.map,
                        icon: humanMissionImage,
                        shape: shape,
                        title: mission.name,
                        zIndex: 4
                    });
                    var infowindow = new window.google.maps.InfoWindow({
                        content: contentString
                    });
                    infoWindows.push({ "title": mission.name, "info": infowindow });
                    humanMarker.addListener('click', function () {                        
                        for(var i = 0; i < infoWindows.length; i++) {
                            if(infoWindows[i].title == this.title) {
                                infoWindows[i].info.open(this.map, this);
                            }
                        }
                    });
                } else {
                    // console.log('Player' + this.props.player.player_Id + 'status is ' + player_status + '. The user_Id is ' + this.props.player.user_Id);

                }

            } else {
                // console.log(rightNow > missionStartTime);
                // console.log('mission started');
                // console.log(rightNow < missionDeadline);
                // console.log('mission expired');

            }


        }

        const sw = new window.google.maps.LatLng(this.state.game.se_Lat, this.state.game.nw_Lng);
        const ne = new window.google.maps.LatLng(this.state.game.nw_Lat, this.state.game.se_Lng);
        let bounds = new window.google.maps.LatLngBounds(sw, ne);
        this.map.fitBounds(bounds);

        // setInterval(this.getLocation(this.map), 10000);
        this.renderCheckIns();


    }

    async renderCheckIns() {
        // console.log('Youve reached the google map element');

        if (this.props.squad_id) {
            const checkinURL = backEndUrl + `${this.props.game_id}/squad/${this.props.squad_id}/check-in`;

            const humanCheckinImage = {
                url: 'https://retohercules.com/images/youtube-thumbs-up-transparent-4.png',
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new window.google.maps.Size(75, 58), // scaled size
                origin: new window.google.maps.Point(0, 0), // origin
                anchor: new window.google.maps.Point(15, 0) // anchor
            };

            const zombieCheckinImage = {
                url: 'https://dejpknyizje2n.cloudfront.net/marketplace/products/thumbs-up-zombie-hand-sticker-1541548841.7296891.png',
                // This marker is 20 pixels wide by 32 pixels high.
                scaledSize: new window.google.maps.Size(35, 35), // scaled size
                origin: new window.google.maps.Point(0, 0), // origin
                anchor: new window.google.maps.Point(15, 0) // anchor
            };

            await fetch(checkinURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                }
            }).then(resp => resp.json())
                .then(resp => {
                    // console.log(resp);
                    this.setState({
                        checkins: [...resp]
                    })
                    // console.log('you have now checked in');

                }).catch(error => {
                    // console.log('you are not checked in');

                    // console.log(error);
                })

            // // console.log('This player is ' + this.props.player.is_Human);


            for (var i = 0; i < this.state.checkins.length; i++) {
                var checkin = this.state.checkins[i];
                var text = `Player ${checkin.squad_Member_Id} checked in at ${checkin.start_Time}`

                if (this.props.player.is_Human) {
                    var humanCheckin = new window.google.maps.Marker({
                        position: { lat: checkin.lat, lng: checkin.lng },
                        map: this.map,
                        icon: humanCheckinImage,
                        title: text,
                        zIndex: 5
                    });
                    //   var infowindow = new window.google.maps.InfoWindow({
                    //     content: contentString
                    //   });
                    //   humanCheckin.addListener('click', function() {
                    //     infowindow.open(this.map, humanCheckin);
                    //   });

                } else {
                    var zombieCheckin = new window.google.maps.Marker({
                        position: { lat: checkin.lat, lng: checkin.lng },
                        map: this.map,
                        icon: zombieCheckinImage,
                        title: text,
                        zIndex: 5
                    });

                }

            }
        }
    }



    async componentDidMount() {
        const id = this.props.game_id;
        const targetUrl = backEndUrl + `${id}`;

        if(!navigator.geolocation) {
            alert("Your browser does not support geolocation. Some features will be unavailable.")
            return
        }

        navigator.geolocation.getCurrentPosition(this.startContinuousLocationPolling, this.handleLocationError)

        //need to set in the correct 
        await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        })
        .then(resp => resp.json())
        .then(resp => {
            // // console.log(resp);
            this.setState({
                game: resp
            });
            // console.log(this.state.game.nw_Lng);

        }).catch(error => {
            // console.log(error);

        });

        this.renderMap();
        // this.setInt();
        
    }

    handleLocationError(err) {
        let msg = ""
        let note = "Some features will be unavailable."

        switch(err.code) {
            case err.PERMISSION_DENIED:
                msg = `Humans vs Zombies does not have permission to use your location. ${note} Please change your settings.`
                break
            case err.POSITION_UNAVAILABLE:
                msg = `Could not find your position. ${note} Try changing your settings or refreshing the page.`
                break
            case err.TIMEOUT:
                msg = `Location request timed out. Check your internet connection. ${note}`
                break
            default:
                msg = `An unknown error occurred. ${note} Please refresh the page to try again.`
                break
        }

        alert(msg)
    }

    startContinuousLocationPolling = () => {
        //this is probably the best way to do it at least for our purposes
        this.interval = setInterval(() => {

            navigator.geolocation.getCurrentPosition(position => {
                var updatedPosition = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                
                this.positionMarker.setPosition(updatedPosition);

                for (var i = 0; i < this.state.missions.length; i++) {
                    var latLng1 = new window.google.maps.LatLng(this.state.missions[i].latitude, this.state.missions[i].longitude);
                    var latLng2 = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    var distanceBetween = window.google.maps.geometry.spherical.computeDistanceBetween(
                        latLng1,
                        latLng2
                    );
                    // // console.log(distanceBetween);
                    if (distanceBetween < 50) {
                        alert(`You have achieved ${this.state.mission[i].name}`);
                    }


                }

            }, error => {
                console.error(error)
            });

        }, 1000)
    }

    stopContinuousLocationPolling() {
        clearInterval(this.interval)
    }

    componentWillUnmount() {
        this.stopContinuousLocationPolling()
    }

    // sendMeASign () {
    //     // console.log("Help me out here");
        
    // }

    updateMissions = () => {
        // console.log("really hoping this works");
        this.renderMap();
    }

    render() {
        return (
            <React.Fragment /*loadMap={this.renderMap}*/>
                <div className={styles.MapDiv}>
                    <div id="map" ref={this.mapEl} className={styles.Map}>
                    </div>
                    <div className={styles.hidden}>
                        <button id="HiddenButton" className={styles.hidden} onClick={this.renderMap}></button>
                    </div>
                </div>
                <div style={{display: this.state.userInfo.is_admin === false ? 'none' : 'block'}}>
                    <MissionList game_id={this.state.game.game_Id} userInfo={this.state.userInfo} missions={this.state.missions} onUpdateMap={this.renderMap} updateMissions={this.updateMissions}></MissionList>
                </div>
                
            </React.Fragment>

        )
    }
}

export default GoogleMap;