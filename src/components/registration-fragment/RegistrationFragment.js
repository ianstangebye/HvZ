import React from 'react';
import styles from './RegistrationFragment.module.css';
import axios from 'axios'

class RegistrationFragment extends React.Component {
    joinGame = () => {
        const crypto = require("crypto");
        const biteCode = crypto.randomBytes(10).toString('hex');

        const newPlayer = {
            is_Human: true,
            is_Patient_Zero: false,
            bite_Code: biteCode,
            user_Id: this.props.user_id,
            game_Id: this.props.game_id
        }

        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/player`;

        axios.post(url, newPlayer)
        .then(resp => {
            if (resp.status === 200) {
                console.log(`Created player with id: ${resp.data}`)
                this.props.onUpdate()
            } else {
                throw new Error(`STATUS CODE: ${resp.status}`)
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    leaveGame = () => {
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.props.game_id}/player/${this.props.player_id}`;

        fetch(url, {
            method: 'DELETE'
        })
        .then(resp => {
            if (resp.status === 200) {
                console.log(`Deleted player with id: ${this.props.player_id}`);
                this.props.onUpdate()
            } else {
                throw new Error(`STATUS CODE: ${resp.status}`)
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    render() {
        const pid = this.props.player_id
        const action = pid ? this.leaveGame : this.joinGame
        const txt = pid ? "Leave Game" : "Join Game"

        return (
            <button className={styles.RegistrationFragment} onClick={action}>{txt}</button>
        )
    }
}

export default RegistrationFragment