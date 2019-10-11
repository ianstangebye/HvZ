import React from 'react';
import Styles from './BiteCodeEntry.module.css';
import { isLVal } from '@babel/types';

class BiteCodeEntry extends React.Component{
    
    state = {
        biteCode: ''
    }

        // Get id from the button/game clicked on from the list? 
        //const {game_id} = this.props.match.params;

        updateInputValue = (name, e) => {
            this.setState({ [name]: e.target.value});
            
        }
    
        handleRegisterClick = event => {
            const bite={
                "biteCode": this.state.biteCode
            }
            
        
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/2`

        fetch(proxyUrl+targetUrl, {
            method: 'GET',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(bite)
        }).then(function(resp) {
            return resp.json();
        }).then(function(data) {
            console.log('Sent in bite:', data);
        }).catch(error => {
            console.log(error);
        })
    }

    render(){ 
        return(
            <form>
                <label htmlFor="biteCode">Bite Code:</label>
                <input name="biteCode" type="text" value={this.state.biteCode} onChange={(e) => this.updateInputValue("biteCode", e)}/>
            </form>
        )
    }
}

export default BiteCodeEntry;