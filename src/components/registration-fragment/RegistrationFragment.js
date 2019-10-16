import React from 'react';
import styles from './RegistrationFragment.module.css';

export default class RegistrationFragment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user_id: '',
            game_id: '',
            biteCode: ''
        }
    }

    componentDidMount() {
        const crypto = require("crypto");
        const result = crypto.randomBytes(10).toString('hex');
        this.setState({biteCode: result})
    }

    handleOnClick = event => {
        console.log('join game');

        const newPlayer = {
            "is_Human": true,
            "is_Patient_Zero": false,
            "bite_Code": this.state.biteCode,
            "user_Id": this.props.user_id,
            "game_Id": this.props.game_id
        }

        console.log("PLAYER OBJECT:")
        console.log(newPlayer)
        
        
        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/1/player'
        
        const that = this;

        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newPlayer)
        }).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            console.log('Joined game:', data);
            that.props.handleRegister(data)
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