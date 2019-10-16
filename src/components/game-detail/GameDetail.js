import React from 'react'
import styles from './GameDetail.module.css'
import TitleFragment from '../title-fragment/TitleFragment'
import SquadListFragment from '../squad-list-fragment/SquadListFragment'
import ChatFragment from '../chat-fragment/ChatFragment'
import axios from 'axios'
import RegistrationFragment from '../registration-fragment/RegistrationFragment'
import BiteCodeFragment from '../bite-code-fragment/BiteCodeFragment'
import BiteCodeEntry from '../bite-code-entry/BiteCodeEntry'
import GoogleMap from '../google-map/GoogleMap'

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
        //const user_id = sessionStorage.getItem("user_id")
        const user_id = this.props.location.state.user_id;
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/user/${user_id}player`

        // Get and store this user's player object, if it exists, in session storage
        axios
        .get(url)
        .then(res => {
            console.log("TESTING:")
            console.log(res)

            if(res.status === 200) {
                this.setState({
                    joined: true,
                    player: res.data
                })
            } else {
                throw new Error(`STATUS CODE: ${res.status}`)
            }
        })
        .catch(e => {
            console.error(e)
        })

        this.setState({ game_id: game_id }, () => {
            // console.log("GAME ID: " + this.state.game_id);
            // console.log("USER ID: " + sessionStorage.getItem("user_id"))

            // this.checkAlreadyLoggedIn();
            console.log("detail game_id: " + this.state.game_id);
            this.checkAlreadyJoined(game_id, user_id);
        });
        
    }

    async checkAlreadyJoined(game_id, user_id) {
        //const { game_id } = this.props.match.params;
        //const user_id = window.sessionStorage.getItem("user_id");
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/user/${user_id}/player`;
        console.log("gamedetail url: " + targetUrl);
        
        const that = this;

        fetch(targetUrl, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
                //need token
            }
        }).then(resp => {
            console.log(resp);
            if(resp.status == 200) {
                return resp;
            }
        }).then(resp => resp.json()).then(resp => {  
            console.log("Gamedetail check: ");
                 
            console.log(resp);
            that.setState({
                player: resp,
                player_id: resp.player_Id
            });
            that.updateJoined(resp.player_Id);  
        }).catch(function (e) {
            console.log("User is not joined a game yet " + e);
        });
    };

    joinGame = () => {
        const newPlayer = {
            is_Human: true,
            is_Patient_Zero: false,
            bite_Code: "testbitecode",
            //user_Id: window.sessionStorage.getItem("user_id") || 0,
            user_Id: this.props.location.state.user_id,
            game_Id: this.state.game_id
        }

        console.log("Join new player: ");
        console.log(newPlayer);
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/player`;

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
                
                //window.sessionStorage.setItem("player_id", resp);
                this.setState({
                    player: newPlayer
                })
                this.updateJoined(resp);
            } else {
                console.log("Creation faild");
            }
        }).catch(function (e) {
            console.log(e);
        });
    }

    leaveGame = () => {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/player/${this.state.player_id}`;

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
                
                //window.sessionStorage.setItem("player_id", 0);
                this.updateLeaved();
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
        let id = this.state.game_id
        let player = this.state.player;
        let registrationFragment;

        if(this.state.joined) {
            registrationFragment = <RegistrationFragment game_id={id} player={player} className={styles.join_btn} />
        } else {
            registrationFragment = <button className={styles.leave_btn} onClick={this.leaveGame}>Leave Game</button>
        }

        if (id === 0) return (<h1>Loading Game Detail...</h1>)

        return (
            <React.Fragment>
                {/* WE NEED SOME MORE LOGIC TO DECIDE WHICH COMPONENTS TO SHOW BASED ON THE USER'S ROLE, WHETHER THEY'RE A PLAYER OR NOT, AND IF THEY ARE; THEIR PLAYER INFO */}

                <BiteCodeFragment game_id={id} player={player} />
                <BiteCodeEntry game_id={id} player={player} />
                { registrationFragment }
                <TitleFragment game_id={id} />
                <SquadListFragment game_id={id} player_id={player.player_id} />
                <ChatFragment game_id={id} player_id={player.player_id} />
                <GoogleMap game_id={id} player={player} />

            </React.Fragment>
        )
    }
}

export default GameDetail