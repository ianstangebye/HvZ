import React from 'react';
// import Styles from './GameList.module.css';
import GameItem from '../game-item/GameItem';
// import { read } from 'fs';

class GameList extends React.Component{
    state = {
        games: []
    }

componentDidMount(){
    //need to set in the correct 
    fetch('http://localhost:56306/game').then(resp=> resp.json())
    .then(resp=>{
        console.log(resp);
        this.ListeningStateChangedEvent({
           games:  [...resp]
        });
    }).catch(error=>{
        console.log(error);
        
    });
}


render(){

    let gameComponents = null;
    if(this.state.games.length>0){
        gameComponents = this.state.games.map(game=>{
            return <GameItem />
        });
    } else {
        gameComponents = <p>Loading games...</p>
    }

    return (
        <React.Fragment>
            <h1>Currently available games</h1>
            <div>
                {gameComponents}
            </div>
        </React.Fragment>
    )
}
}