import React from 'react';
// import Styles from './GameList.module.css';
import GameItem from '../game-item/GameItem';
// import { read } from 'fs';

class GameList extends React.Component{
    
    state = {
        games: []
    }

    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         games: []
    //     }
    // }

componentDidMount(){
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game`;

    console.log("something");
    
    //need to set in the correct 
    fetch(proxyUrl + targetUrl).then(resp=> resp.json())
    .then(resp=>{
        console.log(resp);
        this.setState({
           games:  [...resp]
        });
        console.log(this.state.games);
        
    }).catch(error=>{
        console.log('Something fucked up')
        console.log(error);
        
    });
}


render(){

    console.log(this.state.games);

    let gameComponents = null;


    if(this.state.games.length>0){
        gameComponents = this.state.games.map(game=>{
            return <GameItem game={game} key={game.game_Id}/>
            //return <p>hELLOOOO</p>
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
    );
}
}

export default GameList;