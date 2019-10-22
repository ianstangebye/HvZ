import React from 'react';
import styles from './EditPlayerItem.module.css';

export default class EditPlayerItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerState: '',
            newPlayerState: null
        }
    }

    componentDidMount() {
        if (this.props.player.is_Human) {
            this.setState({ playerState: 'Human', newPlayerState: false })
        } else if (!this.props.player.is_Human) {
            this.setState({ playerState: 'Zombie', newPlayerState: true })
        }
    }

    handleEditClick = async () => {
        console.log(this.state.selectedPlayerState);
        console.log('THIS PLAYER:', this.props.player.player_Id);
        

        const updatedPlayer = {
            player_Id: this.props.player.player_Id,
            is_Human: this.state.newPlayerState,
            user_Id: this.props.player.user_Id,
            game_Id: this.props.game_id,
            is_Patient_Zero: this.props.player.is_Patient_Zero,
            bite_Code: this.props.player.bite_Code,
            username: this.props.player.username
        }

        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/player/${this.props.player.player_Id}` 
        await fetch(targetUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.props.userInfo.token
            },
            body: JSON.stringify(updatedPlayer)
        }).then(resp => resp.json())
        .then(data => {
            console.log('Updated Player: ', data);
        })
        .catch(e => {
            console.log(e);
        })
    }
    render() {
        return (
            <React.Fragment>
                <div className={styles.EditPlayerItem}>
                    <p>Player: {this.props.player.username}</p>
                    <p>State: {this.state.playerState}</p>
                    <button type="button" onClick={this.handleEditClick}>Edit</button>
                </div>
            </React.Fragment>
        )
    }
}