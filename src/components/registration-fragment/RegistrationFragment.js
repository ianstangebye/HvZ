import React from 'react';
import styles from './RegistrationFragment.module.css';
import axios from 'axios'

class RegistrationFragment extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            player_id: this.props.player_id,
            user_id: this.props.user_id,
            game_id: this.props.game_id,
            squad_id: this.props.squad_id,
            squad_member_id: this.props.squad_member_id
        }
    }

    componentWillReceiveProps() {
        this.setState({
            player_id: this.props.player_id,
            user_id: this.props.user_id,
            game_id: this.props.game_id,
            squad_id: this.props.squad_id,
            squad_member_id: this.props.squad_member_id
        })
    }

    joinGame = () => {
        const crypto = require("crypto");
        const biteCode = crypto.randomBytes(10).toString('hex');

        const newPlayer = {
            is_Human: true,
            is_Patient_Zero: false,
            bite_Code: biteCode,
            user_id: this.props.user_id,
            game_id: this.props.game_id
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
        const gid = this.state.game_id;
        const pid = this.state.player_id;
        const sid = this.state.squad_id;
        const smid = this.state.squad_member_id;

        //Delete SquadMember object first
        if(sid != 0 && smid != 0) { 
            const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${gid}/squad/${sid}/member/${smid}`;

            fetch(url, {
                method: 'DELETE'
            })
            .then(resp => {
                if (resp.status === 200) {
                    console.log(`Deleted squad_member with id: ${smid}`);
                    //this.props.onUpdate()
                } else {
                    throw new Error(`STATUS CODE: ${resp.status}`)
                }
            })
            .catch(e => {
                console.error(e);
            });
        }

        // Delete player object
        const url = `http://case-hvzapi.northeurope.azurecontainer.io/game/${gid}/player/${pid}`;

        fetch(url, {
            method: 'DELETE'
        })
        .then(resp => {
            if (resp.status === 200) {
                console.log(`Deleted player with id: ${pid}`);
                this.props.onUpdate();
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
            <div className={styles.RegistrationFragment}>
                <button onClick={action}>{txt}</button>
            </div>
            
        )
    }
}

export default RegistrationFragment