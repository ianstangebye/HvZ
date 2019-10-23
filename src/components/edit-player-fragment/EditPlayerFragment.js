import React from 'react';
import styles from './EditPlayerFragment.module.css';
import EditPlayerItem from '../edit-player-item/EditPlayerItem';

export default class EditPlayerFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            players: [],
            game_id: props.game_id,
            userInfo: props.userInfo,
            isVisible: false
        }

        
    }

    componentDidMount() {

        this.getPlayers();

    }

    getPlayers = () => {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/player`
    
        fetch(targetUrl, {
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

    handleShowPlayers = async () => {
        this.setState({isVisible: !this.state.isVisible})
        if (this.state.isVisible === false) {
            document.getElementById("ShowPlayersBtn").innerText = 'Close Edit';
        } else {
            document.getElementById("ShowPlayersBtn").innerText = 'Edit Players';
        }

    }

    render() {

        let playerComponents = null; 

        if(this.state.players.length > 0) {
            playerComponents = this.state.players.map((player) =>
                <EditPlayerItem onUpdate={this.getPlayers} player={player} key={player.player_Id} game_id={this.state.game_id} userInfo={this.state.userInfo} />
            )
        }

        return(
            <React.Fragment>
                <div className={styles.EditPlayerFragment} style={{display: this.state.players.length === 0 ? 'none' : 'block'}}>
                    <button id="ShowPlayersBtn" className={styles.Btn} onClick={this.handleShowPlayers}>Edit players</button>
                    <div className={styles.PlayerComponents} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                        {playerComponents}
                    </div>
                </div>
                
            </React.Fragment>
            
        )
    }
}