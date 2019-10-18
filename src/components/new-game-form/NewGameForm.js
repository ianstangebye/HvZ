import React from 'react';
import styles from './NewGameForm.module.css';
import { geolocated } from "react-geolocated";
import { Redirect } from 'react-router';
import Calendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'

class NewGameForm extends React.Component {

    constructor(props) {
        super(props);

        const date = new Date()
        const startDate = date.getTime()
        const endDate = new Date(startDate).setDate(date.getDate() + 1);

        this.state = {
            is_admin: false,
            name: "",
            nw_latitude: 0,
            nw_longitude: 0,
            se_latitude: 0,
            se_longitude: 0,
            description: "",
            start_time: new Date(startDate).toLocaleString(), 
            end_time: new Date(endDate).toLocaleString(),
            creationSuccess: false,
            calenderOn: false
        };
    }

    updateInputValue = (name, e) => {
        this.setState({ [name]: e.target.value });

    }

    getLocation = () => {
        if (!this.props.isGeolocationAvailable) {
            console.log("Your browser does not support Geolocation");
        } else if (!this.props.isGeolocationEnabled) {
            console.log("Geolocation is not enabled");
        }
        if (this.props.coords) {
            this.setState({
                nw_latitude: this.props.coords.latitude + 0.01,
                nw_longitude: this.props.coords.longitude - 0.01,
                se_latitude: this.props.coords.latitude - 0.01,
                se_longitude: this.props.coords.longitude + 0.01
            });
        }
    }

    toggleCalender = () => {
        const toggle = this.state.calenderOn ? false : true;

        this.setState({
            calenderOn: toggle
        })
    }

    createNewGame = () => {
        if (this.state.name === "") {
            alert("Please fill the input boxes");
        } else {
            const newGame = {
                "name": this.state.name,
                "game_state": "Registration",
                "nw_lat": this.state.nw_latitude,
                "nw_lng": this.state.nw_longitude,
                "se_lat": this.state.se_latitude,
                "se_lng": this.state.se_longitude,
                "description": this.state.description,
                "start_time": this.state.start_time,
                "end_time": this.state.end_time
            }

            const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game'

            fetch(targetUrl, {
                method: 'POST',
                body: JSON.stringify(newGame),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                    //need token 
                }
            }).then(resp => {
                if(resp.status !== 200) {
                    alert("Creation Failed!");
                } else {
                    this.setState({ creationSuccess: true });
                }
            });
        }
    }

    componentDidMount() {

    }
    
    onCalenderChange = (start_time, end_time) => {
        console.log(start_time);
        console.log(end_time);
        
        this.setState({
            start_time: new Date(start_time).toLocaleString(),
            end_time: new Date(end_time).toLocaleString()
        })
    }

    render() {
        if(this.state.creationSuccess) {
            return <Redirect push to="/" />; 
        }

        let calender = null;

        const startDate = new Date(this.state.start_time).getTime()
        const endDate = new Date(this.state.end_time).getTime()

        if(this.state.calenderOn) {
            calender = <Calendar startDate={startDate} endDate={endDate} onChange={this.onCalenderChange} range displayTime timezone="Europe/Oslo"/>
        } else {
            calender = null;
        }

        return (
            <div className={styles.RegisterForm}>
                <h4>Create a new game</h4>
                <form>
                    <div>
                        <label>Name</label>
                        <input autoFocus type="text" name="name" placeholder="Type in a name..." maxLength="50" value={this.state.name} onChange={(e) => this.updateInputValue("name", e)} />
                    </div>
                    <div>
                        <label>North-west Latitude</label>
                        <input type="text" name="nw_latitude" maxLength="50" value={this.state.nw_latitude} onChange={(e) => this.updateInputValue("nw_latitude", e)}></input>
                    </div>
                    <div>
                        <label>North-west Longitude</label>
                        <input type="text" name="nw_longitude" maxLength="50" value={this.state.nw_longitude} onChange={(e) => this.updateInputValue("nw_longitude", e)}></input>
                    </div>
                    <div>
                        <label>South-east Latitude</label>
                        <input type="text" name="se_latitude" maxLength="50" value={this.state.se_latitude} onChange={(e) => this.updateInputValue("se_latitude", e)}></input>
                    </div>
                    <div>
                        <label>South-east Longitude</label>
                        <input type="text" name="se_longitude" maxLength="50" value={this.state.se_longitude} onChange={(e) => this.updateInputValue("se_longitude", e)}></input>
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea rows="4" cols="50" name="description" placeholder="Add a description of the game..." value={this.state.description} onChange={(e) => this.updateInputValue("description", e)}>
                        </textarea>
                    </div>
                    <div>
                        <label>Start Time</label>
                        <input type="text" name="start_time" maxLength="50" value={this.state.start_time} onChange={(e) => this.updateInputValue("start_time", e)}></input>
                    </div>
                    <div>
                        <label>End Time</label>
                        <input type="text" name="end_time" maxLength="50" value={this.state.end_time} onChange={(e) => this.updateInputValue("end_time", e)}></input>
                    </div>
                </form>
                
                {calender}

                <div className={styles.Btns}>
                    <button className={styles.BtnGetLocation} onClick={this.getLocation}>Get Location</button>
                    <button className={styles.BtnGetLocation} onClick={this.toggleCalender}>Get Time</button>
                    <button className={styles.BtnCreate} onClick={this.createNewGame}>Create Game</button>
                </div>
            </div>
        )
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(NewGameForm);
//export default NewGameForm;