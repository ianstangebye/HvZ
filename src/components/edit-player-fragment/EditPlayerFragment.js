import React from 'react';
import styles from './EditPlayerFragment.module.css';
import EditPlayerItem from '../edit-player-item/EditPlayerItem';

export default class EditPlayerFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            game_id: props.game_id,
            userInfo: props.userInfo
        }
    }

    componentDidMount() {
        
            
        this.handleGetPlayers(this);
    }

    handleGetPlayers = async (that) => {
        console.log(this.state.game_id);
        
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/player`
    
        await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        }).then(resp => resp.json())
        .then(resp => {
            this.setState({
                players: [...resp]
            });
        }).catch(e => {
            console.log(e);
        })


    }

    render() {

        let playerComponents = null; 

        if(this.state.players.length > 0) {
            playerComponents = this.state.players.map((player) =>
                <EditPlayerItem player={player} key={player.player_Id} game_id={this.state.game_id} userInfo={this.state.userInfo} />
            )
        }

        return(
            <React.Fragment>
                <button onClick={this.handleGetPlayers}>Click to edit players</button>
                <div>
                    {playerComponents}
                </div>
            </React.Fragment>
            
        )
    }
}