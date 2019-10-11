import React from 'react';
import styles from './RegistrationFragment.module.css';

export default class RegistrationFragment extends React.Component {

    /*==============
    Get user_id and game_id
    ============== */
    state = {
        user_Id: '',
        game_Id: '',
        biteCode: ''
    }
    
    componentDidMount() {
        const crypto = require("crypto");
        const result = crypto.randomBytes(10).toString('hex');
        this.state.biteCode = result;
    }

    handleOnClick = event => {
        console.log('join game');

        const newPlayer = {
            "is_Human": true,
            "is_Patient_Zero": false,
            "bite_Code": this.state.biteCode,
            "user_Id": 7,
            "game_Id": 1
        }
        
        
        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/1/player'
        
        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newPlayer)
        }).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            console.log('Joined game:', data);
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return (
            <React.Fragment>
                <button className={styles.RegistrationFragment} onClick={this.handleOnClick}>Join Game</button>
            </React.Fragment>
        )
    }
}