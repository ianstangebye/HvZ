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

    updatePlayerState = () => {
        this.setState({newPlayerState: !this.state.newPlayerState})

        if (this.state.newPlayerState === false) {
            this.setState({playerState: 'Human'})
        } else if (this.state.newPlayerState === true) {
            this.setState({playerState: 'Zombie'})
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
            this.updatePlayerState();
        })
        .catch(e => {
            console.log(e);
        })
    }
    render() {
        return (
            <React.Fragment>
                <div className={styles.EditPlayerItem}>
                    <p><b>Player: </b>{this.props.player.username}</p>
                    <p><b>State: </b>{this.state.playerState}</p>
                    <button type="button" onClick={this.handleEditClick}>Edit State</button>
                </div>
            </React.Fragment>
        )
    }
}