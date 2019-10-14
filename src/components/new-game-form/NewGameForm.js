import React from 'react';
import styles from './NewGameForm.module.css';
import { geolocated } from "react-geolocated";
import { Redirect } from 'react-router';

class NewGameForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            is_admin: false,
            name: "",
            nw_latitude: 0,
            nw_longitude: 0,
            se_latitude: 0,
            se_longitude: 0,
            description: "",
            creationSuccess: false
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
                nw_longitude: this.props.coords.longitude + 0.01,
                se_latitude: this.props.coords.latitude - 0.01,
                se_longitude: this.props.coords.longitude - 0.01
            });
        }
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
                "description": this.state.description
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

    render() {
        if(this.state.creationSuccess) {
            return <Redirect push to="/" />; 
        }

        return (
            <div className={styles.RegisterForm}>
                <form>
                    <div>
                        <label>Name of Game</label>
                        <input autoFocus type="text" name="name" maxLength="50" value={this.state.name} onChange={(e) => this.updateInputValue("name", e)} />
                    </div>
                    <div>
                        <label>NW_Latitude</label>
                        <input type="text" name="nw_latitude" maxLength="50" value={this.state.nw_latitude} onChange={(e) => this.updateInputValue("nw_latitude", e)}></input>
                    </div>
                    <div>
                        <label>NW_Longitude</label>
                        <input type="text" name="nw_longitude" maxLength="50" value={this.state.nw_longitude} onChange={(e) => this.updateInputValue("nw_longitude", e)}></input>
                    </div>
                    <div>
                        <label>SE_Latitude</label>
                        <input type="text" name="se_latitude" maxLength="50" value={this.state.se_latitude} onChange={(e) => this.updateInputValue("se_latitude", e)}></input>
                    </div>
                    <div>
                        <label>SE_Longitude</label>
                        <input type="text" name="se_longitude" maxLength="50" value={this.state.se_longitude} onChange={(e) => this.updateInputValue("se_longitude", e)}></input>
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea rows="4" cols="50" name="description" value={this.state.description} onChange={(e) => this.updateInputValue("description", e)}>
                            At w3schools.com you will learn how to make a website. We offer free tutorials in all web development technologies.
                        </textarea>
                    </div>

                </form>
                <div className={styles.Btns}>
                    <button className={styles.BtnCreate} onClick={this.createNewGame}>Create Game</button>
                    <button className={styles.BtnGetLocation} onClick={this.getLocation}>Get Location</button>
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