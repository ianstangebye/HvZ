import React from 'react';
import Styles from './BiteCodeEntry.module.css';
import { isLVal } from '@babel/types';

class BiteCodeEntry extends React.Component{
    
    state = {
        biteCode: '',
        lat: '',
        lng: ''
    }

        // Get id from the button/game clicked on from the list? 
        //const {game_id} = this.props.match.params;

        updateInputValue = (name, e) => {
            this.setState({ [name]: e.target.value});
            
        }
    
        handleRegisterClick = event => {
            event.preventDefault();

            
        
            const game_id = this.props.match.params.game_id;
            console.log(game_id);
            console.log(new Date().toISOString());
            console.log(sessionStorage.getItem("user_id"));
            let bite={
                time_Of_Death: new Date().toISOString(),
                game_Id: game_id,
                killer_Id: sessionStorage.getItem("user_id"),
                bite_Code: this.state.biteCode,
                


            }

        navigator.geolocation.getCurrentPosition(
            // On success
            position => 
            // console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`),
            this.setState({lat:position.coords.latitude,lng: position.coords.longitude }),
            console.log(this.state),
            // On error
            err => alert(`Error (${err.code}): ${err.message}`)
          );
        
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/kill`

        fetch(targetUrl, {
            method: 'POST',
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
            <form onSubmit={this.handleRegisterClick}>
                <label htmlFor="biteCode">
                    Bite Code:
                    <input name="biteCode" type="text" value={this.state.biteCode} onChange={(e) => this.updateInputValue("biteCode", e)}/>
                </label>
               <input type="submit" />
            </form>
        )
    }
}

export default BiteCodeEntry;