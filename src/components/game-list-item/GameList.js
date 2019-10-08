import React from 'react';
// import Styles from './GameList.module.css';
import GameItem from '../game-item/GameItem';
// import { read } from 'fs';

class GameList extends React.Component{
    state = {
        games: []
    }

async componentDidMount(){
    //need to set in the correct 
    await fetch('http://localhost:56306/game').then(resp=> resp.json())
    .then(resp=>{
        console.log(resp);
        this.setState({
           games:  [...resp]
        });
        console.log(games);
        
    }).catch(error=>{
        console.log('Something fucked up')
        console.log(error);
        
    });
}


render(){

    let gameComponents = null;
    if(this.state.games.length>0){
        gameComponents = this.state.games.map(game=>{
            return <GameItem game={game} key={game.game_Id}/>
        });
    } else {
        gameComponents = <p>Loading games...</p>
    }

    return (
        <React.Fragment>
            <h1>Currently available games</h1>
            <div>
                {/* {gameComponents} */}
            </div>
        </React.Fragment>
    )
}
}