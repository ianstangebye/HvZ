import React from 'react';
import styles from './GameDetail.module.css';
import TitleFragment from '../title-fragment/TitleFragment';
import SquadListFragment from '../squad-list-fragment/SquadListFragment';
import ChatFragment from '../chat-fragment/ChatFragment';
import axios from 'axios';
import RegistrationFragment from '../registration-fragment/RegistrationFragment';

class GameDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game_id: 0,
            player_id: 0,
            squad_id: 0,
            joined: false,
            player: {}
        }
    }

    componentDidMount() {
        const { game_id } = this.props.match.params
        const user_id = sessionStorage.getItem("user_id")
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/user/${user_id}`

        // Get and store this user's player object, if it exists, in session storage
        axios
        .get(url)
        .then(res => {
            console.log("TESTING:")
            console.log(res)

            if(res.status === 200) {
                this.setState({
                    joined: true,
                    player: res
                })
            } else {
                throw new Error(`STATUS CODE: ${res.status}`)
            }
        })
        .catch(e => {
            
            // NB!! FOR TESTING ------------------------------
            let player = {
                player_id: 8,
                is_human: true,
                is_patient_zero: true,
                bite_code: "placeholderbitecode",
                user_id: sessionStorage.getItem("user_id"),
                game_id: game_id
            }

            this.setState({
                joined: true,
                player: player
            })
            // -----------------------------------------------

 
            console.error(e)
        })

        this.setState({ game_id: game_id }, () => {
            console.log("detail game_id: " + this.state.game_id);
            this.checkAlreadyLoggedIn();
        });
        
    }

    async checkAlreadyLoggedIn() {
        const { game_id } = this.props.match.params;
        const user_id = window.sessionStorage.getItem("user_id");        
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/user/${user_id}/player`;

        const that = this;

        fetch(targetUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                //need token
            }
        }).then(resp => resp.json()).then(resp => {       
            console.log(resp);
            
            that.setState({
                player: resp,
                player_id: resp.player_Id
            });
            that.updateJoined(resp.player_Id);       
        }).catch(function (e) {
            console.log("User is not joined a game yet");
        });
    };

    joinGame = () => {
        const newPlayer = {
            is_Human: true,
            is_Patient_Zero: false,
            bite_Code: "testbitecode",
            user_Id: sessionStorage.getItem("user_id") || 0,
            game_Id: this.state.game_id
        }

        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/player`;

        const that = this;

        fetch(targetUrl, {
            method: 'POST',
            body: JSON.stringify(newPlayer),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                //need token
            }
        }).then(resp => resp.json()).then(resp => {
            if (resp !== -1) {
                console.log('Created new player');
                console.log(resp);
                
                window.sessionStorage.setItem("player_id", resp);
                that.setState({
                    player: newPlayer
                })
                that.updateJoined(resp);
            } else {
                console.log("Creation faild");
            }
        }).catch(function (e) {
            console.log(e);
        });
    }

    leaveGame = () => {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/player/${this.state.player_id}`;

        const that = this;

        fetch(targetUrl, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                //need token
            }
        }).then(resp => resp.json()).then(resp => {
            if (resp !== false) {
                console.log(`Deleted player ${this.state.player_id}`);
                console.log(resp);
                
                window.sessionStorage.setItem("player_id", 0);
                that.updateLeaved();
            } else {
                console.log("Deleted faild");
            }
        }).catch(function (e) {
            console.log(e);
        });
    }

    updateJoined(player_id) {
        this.setState({ 
            joined : true,
            player_id : player_id
        });
    }

    updateLeaved() {
        this.setState({ 
            joined : false,
            player_id : 0
        });
    }

    handleJoinSquad(squad_id) {
        console.log(`join squad ${squad_id} in game detail`);
        
    }

    render() {
        let player = this.state.player;
        let joinButton = <RegistrationFragment player={player} className={styles.join_btn} onClick={this.joinGame} />
        let leaveButton = <button className={styles.leave_btn} onClick={this.leaveGame}>Leave Game</button>

        if (this.state.game_id === 0) {
            return (
                <h1>Loading Game Detail...</h1>
            )
        } else {
            return (
                <React.Fragment>
                    {this.state.joined ? leaveButton : joinButton}

                    {/* WE NEED SOME LOGIC TO DECIDE WHICH COMPONENTS TO SHOW BASED ON THE USER'S ROLE, WHETHER THEY'RE A PLAYER OR NOT, AND IF THEY ARE; THEIR PLAYER INFO */}

                    <TitleFragment game_id={this.state.game_id} />
                    <SquadListFragment game_id={this.state.game_id} player_id={this.state.player_id} />
                    <ChatFragment game_id={this.state.game_id} player_id={this.state.player_id}></ChatFragment>
                </React.Fragment>
            )
        }
    }
}

export default GameDetail