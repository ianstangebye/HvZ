import React from 'react';
import Styles from './NewGameForm.module.css';

class NewGameForm extends React.Component{

    //Can be that this is the proper syntax, but unable to test rn
    // constructor(props){
    //     super(props);
    //     this.state ={ isLoading: true}
    //   }

    state ={
        name: '',
        gameState: '',
        nwLat: "",
        nwLng: "",
        seLat: "",
        seLng: ""
    }

    update = (name, e) => {
        this.setState({ [name]: e.target.value });
      }

    submitHandler = (event)=>{
        event.preventDefault();
        fetch('Our docker url', 
        {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state)
        }).then(res=>res.json())
        .then(data=>console.log(data))
        .catch(error=>console.log(error));
    }



    
    render (){
        return (
            <form className={Styles.form} onSubmit={this.submitHandler}>
                <label htmlFor="gameName">Game Name</label>
                <input name="gameName" type="text" value={this.state.name} onChange={(e) => this.update("name", e)}/>
                <label htmlFor="gameStart">Game start date:</label>
                <input name="gameStart" value={this.state.gameState} onChange={(e) => this.update("gameState", e)}/>
                <label htmlFor="nwlat">NW Latitude</label>
                <input name="nwlat" value={this.state.nwLat} onChange={(e) => this.update("nwLat", e)}/>
                <label htmlFor="nwlong">NW Longitude</label>
                <input name="nwlong" value={this.state.nwLng} onChange={(e) => this.update("nwLng", e)}/>   
                <label htmlFor="selat">SE Latitude</label>
                <input name="selat" value={this.state.swLat} onChange={(e) => this.update("swLat", e)}/>
                <label htmlFor="selong">SE Longitude</label>
                <input name="selong" value={this.state.swLng} onChange={(e) => this.update("swLng", e)}/>    
                <button type="submit">Create new Game</button>
            </form>
        )
    }

}

export default NewGameForm;