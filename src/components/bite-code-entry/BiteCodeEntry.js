import React from 'react';
import Styles from './BiteCodeEntry.module.css';
import { isLVal } from '@babel/types';

class BiteCodeEntry extends React.Component{
    constructor(props) {
        super(props);
        this.createBite = this.createBite.bind(this);
        this.state = {
        
            biteCode: '',
            lat: null,
            lng: null
        }

    }



        // Get id from the button/game clicked on from the list? 
        //const {game_id} = this.props.match.params;

        updateInputValue = (name, e) => {
            this.setState({ [name]: e.target.value});
            
        }


    
        handleRegisterClick = async event => {
            event.preventDefault();

            // let lat = null;
            // let lng = null;




            navigator.geolocation.getCurrentPosition(
                // On success
                position =>
                // {
                //     this.state.lat = position.coords.latitude;
                //     this.state.lng = position.coords.longitude
                // }, 
                this.setState({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }, function () {
                    console.log('the state has been changed');
                    console.log(this.state.lat + " | " + this.state.lng);
                    this.createBite();
                }),
                // console.log(position.coords.latitude + ' ' + position.coords.longitude),                
                // console.log(`Lat: ${position.coords.latitude} Lng: ${position.coords.longitude}`),                
                // await this.setState({lat: position.coords.latitude,lng: position.coords.longitude }),
                // console.log(this.state),
                // On error
                err => alert(`Error (${err.code}): ${err.message}`)
             );

            
        
            // const game_id = this.props.match.params.game_id;
            // console.log(game_id);
            // console.log(new Date().toISOString());
            // console.log(sessionStorage.getItem("user_id"));
            // console.log(this.state.biteCode);
            
            // let bite={
            //     time_Of_Death: new Date().toISOString(),
            //     game_Id: game_id,
            //     lat: this.state.lat,
            //     lng: this.state.lng,
            //     killer_Id: sessionStorage.getItem("user_id"),
            //     // killer_Id: this.props.player_id,
            //     bite_Code: this.state.biteCode
            // }

            // console.log(bite);
            


        
        
        // const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/kill`

        // // console.log(JSON.stringify(bite));
        
        // fetch(targetUrl, {
        //     method: 'POST',
        //     headers: {'Content-Type':'application/json'},
        //     body: JSON.stringify(bite)
        // }).catch(error => {
        //     console.log(error);
        // })
    }


    createBite = () => {
            const game_id = this.props.match.params.game_id;
            console.log(game_id);
            console.log(new Date().toISOString());
            console.log(sessionStorage.getItem("user_id"));
            console.log(this.state.biteCode);

        let bite={
                time_Of_Death: new Date().toISOString(),
                game_Id: game_id,
                lat: this.state.lat,
                lng: this.state.lng,
                killer_Id: sessionStorage.getItem("user_id"),
                // killer_Id: this.props.player_id,
                bite_Code: this.state.biteCode
            }

            console.log(bite);
            


        
        
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/kill`

        // console.log(JSON.stringify(bite));
        
        fetch(targetUrl, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(bite)
        }).then(resp =>{
            console.log(resp);
            
        }).catch(error => {
            console.log(error);
        })

        // this.props.renderMap();
        this.props.loadMap();

    }

    render(){ 
        // console.log(this.state);
        
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