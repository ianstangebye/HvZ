import React from 'react';
import styles from './RegistrationFragment.module.css';
import axios from 'axios'
import backEndUrl from '../../backEndUrl';

class RegistrationFragment extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            player_id: props.player_id,
            user_id: props.user_id,
            game_id: props.game_id,
            squad_id: props.squad_id,
            squad_member_id: props.squad_member_id,
            game_state: props.game_state,
            userInfo: props.userInfo
        }
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState({
            player_id: this.props.player_id,
            user_id: this.props.user_id,
            game_id: this.props.game_id,
            squad_id: this.props.squad_id,
            squad_member_id: this.props.squad_member_id,
            game_state: this.props.game_state,
            userInfo: this.props.userInfo
        })
    }

    joinGame = () => {
        const crypto = require("crypto");
        const biteCode = crypto.randomBytes(3).toString('hex');

        const newPlayer = {
            is_Human: true,
            is_Patient_Zero: false,
            bite_Code: biteCode,
            user_id: this.props.user_id,
            game_id: this.props.game_id,
            username: this.state.userInfo.username
        }

        const url = backEndUrl + `${this.props.game_id}/player`;

        axios.post(url, newPlayer, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        })
        .then(resp => {
            if (resp.status === 200) {
                console.log("Create player");
                
                // console.log(`Created player with id: ${resp.data}`)
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
        const sid = this.props.squad_id;
        const smid = this.props.squad_member_id;

        //Delete SquadMember object first
        if(sid !== 0 && smid !== 0) { 
            const url = backEndUrl + `${gid}/squad/${sid}/member/${smid}`;

            // console.log("Delete squad member url: " + url);
            
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                }
            })
            .then(resp => {
                if (resp.status === 200) {
                    // console.log(`Deleted squad_member with id: ${smid}`);
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
        const url = backEndUrl + `${gid}/player/${pid}`;

        fetch(url, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        })
        .then(resp => {
            if (resp.status === 200) {
                // console.log(`Deleted player with id: ${pid}`);
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
        let txt = pid ? "Leave Game" : "Join Game"
        const disableBtn = this.props.game_state === "Registration" ? false : true 
        
        if(this.props.game_state !== "Registration") { 
            txt = "Can't join game"
        }

        return (
            <div className={styles.RegistrationFragment} style={{visibility: this.props.game_state === 'Complete' || (this.props.game_state === 'In Progress' && this.props.player_id) ? 'hidden' : 'visible'}}>
                <button onClick={action} disabled={disableBtn}>{txt}</button>
            </div>
        )
    }
}

export default RegistrationFragment