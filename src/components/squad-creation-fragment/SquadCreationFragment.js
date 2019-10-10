import React from 'react';
import styles from './SquadCreationFragment.module.css';

export default class SquadCreationFragment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            is_Human: '', // true or false
            game_Id: '',
            squad_Id: '',
            player_Id: ''
        }
    }

    updateInputValue = (name, e) => {
        this.setState({ [name]: e.target.value});
    }

    // Create a new squad
    onClickCreate = event => {
        console.log(this.state.name);
        console.log('Created');

        const newSquad = {
            "name": this.state.name,
            "is_Human": this.state.is_Human,
            "game_Id": this.state.game_Id
        }

        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/1/squad'
        
        if (this.state.name > 0) {
            fetch(proxyUrl+targetUrl, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(newSquad)
            }).then(function(resp) {
                return resp.json();
            }).then(function(data) {
                console.log('Created Squad:', data);
            }).catch(e => {
                console.log(e);
            })
        }
    }

    //Join the new squad 
    onClickJoin = event => {
        console.log('Joined');

        const newSquadMember = {
            "rank":"Squad Leader",
            "game_Id": this.state.game_Id,
            "squad_Id": this.state.squad_Id,
            "player_Id": this.state.player_Id
        }

        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetUrl = 'http://case-hvzapi.northeurope.azurecontainer.io/game/2/squad/1'

        if (this.state.name > 2) {
            fetch(proxyUrl + targetUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newSquadMember)
            }).then(resp => resp.json()
            ).then(data => console.log('Squadmember joined: ', data)
            ).catch(e => {
                console.log(e);
                
            })
        } else {
            alert('The name must be at least 3 characters')
        }
    }

    render(){
        return(
            <React.Fragment>
                <div className={styles.SquadCreationFragment}>
                    <h2>Create a new squad</h2>
                    <form>
                        <label>Name: </label>
                        <input autoFocus type="text" placeholder="Squad name here..." value={this.state.name} onChange={(e) => this.updateInputValue("name", e)} required></input>
                        
                    </form>
                    <p className={styles.WarningMessage}>{this.state.message}</p>
                    <button onClick={() => {
                        this.onClickCreate();
                        this.onClickJoin();
                    }}>Create & Join</button>
                </div>
            </React.Fragment>
        )
    }
}