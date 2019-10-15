import React from 'react';
import styles from './GameDetail.module.css';
import TitleFragment from '../title-fragment/TitleFragment';
import SquadListFragment from '../squad-list-fragment/SquadListFragment';
import ChatFragment from '../chat-fragment/ChatFragment';

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
        const { game_id } = this.props.match.params;
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

    async leaveGame() {
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
        if (this.state.game_id === 0) {
            return (
                <h1>Loading Game Detail...</h1>
            )
        } else if (!this.state.joined) {
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
                    <button className={styles.leave_btn} onClick={this.leaveGame.bind(this)}>Leave Game</button>
                    <h1>Player {this.state.player_id} joined this game! </h1>
                    <TitleFragment game_id={this.state.game_id}></TitleFragment>
                    <ChatFragment game_id={this.state.game_id} player_id={this.state.player_id}></ChatFragment>
                    <SquadListFragment game_id={this.state.game_id} player_id={this.state.player_id} onJoinSquad={this.handleJoinSquad.bind(this)}></SquadListFragment>
                </React.Fragment>
            )
        }
    }
}

export default GameDetail
