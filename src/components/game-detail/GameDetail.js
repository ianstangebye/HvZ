import React from 'react';
import styles from './GameDetail.module.css';
import TitleFragment from '../title-fragment/TitleFragment';
import SquadListFragment from '../squad-list-fragment/SquadListFragment';
import axios from 'axios';
import { tsExpressionWithTypeArguments } from '@babel/types';

class GameDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            game_id: 0,
            player_id: 0,
            joined: false,
            player: {}
        }
    }

    componentDidMount() {
        const { game_id } = this.props.match.params
        const user_id = sessionStorage.getItem("user_id")
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/user/${user_id}`

        // DO NOT DELETE
        axios
        .get(url)
        .then(res => {
            console.log("TESTING:")
            console.log(res)

            if(res.status === 200) {
                sessionStorage.setItem("player", JSON.stringify(res))
                this.setState({ joined: true })
            } else {
                // NB!! FOR TESTING ------------------------------
                let player = {
                    player_id: 1,
                    is_human: true,
                    is_patient_zero: true,
                    bite_code: "placeholderbitecode",
                    user_id: sessionStorage.getItem("user_id"),
                    game_id: game_id
                }

                sessionStorage.setItem("player", JSON.stringify(player))

                this.setState({
                    player: player
                })

                console.log("PLAYER IN SESSION STORAGE: " + sessionStorage.getItem("player"))
                console.log("PLAYER ID: " + JSON.parse(sessionStorage.getItem("player")).player_id)
                // -----------------------------------------------

                throw new Error(`STATUS CODE: ${res.status}`)
            }
        })
        .catch(e => {
            console.error(e)
        })

        this.setState({ game_id: game_id }, () => {
            console.log("detail game_id: " + this.state.game_id);

        });
        
    }

    async joinGame() {
        const newPlayer = {
            is_Human: true,
            is_Patient_Zero: false,
            bite_Code: "testbitecode",
            user_Id: window.sessionStorage.getItem("user_id") || 0,
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
                that.updateJoined(resp);
            } else {
                console.log("Creation faild");
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

    render() {
        if (!this.state.joined) {
            return (
                <React.Fragment>
                    <button className={styles.join_btn} onClick={this.joinGame.bind(this)}>Join Game</button>
                    <TitleFragment game_id={this.state.game_id}></TitleFragment>
                    <SquadListFragment game_id={this.state.game_id}></SquadListFragment>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <h1>Player {this.state.player_id} joined this game! </h1>
                    <TitleFragment game_id={this.state.game_id}></TitleFragment>
                    <SquadListFragment game_id={this.state.game_id} player_id={this.state.player_id}></SquadListFragment>
                </React.Fragment>
            )
        }
    }
}

export default GameDetail
