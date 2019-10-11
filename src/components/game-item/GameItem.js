import React, {useState, useEffect} from 'react';
// import Styles from './GameList.module.css';

function GameItem (props){


    
    // let game = {
    //     // name: 'Game 1',
    //     // game_State: 'In Progress'
    // };
        
        const {game} = props;
        const [players, setPlayers] = useState([]);
        
        console.log(game.game_Id);
        
        // let [players, setPlayers] = useState(0);
    
        const getPlayers = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game.game_Id}/player`;

        
        useEffect(()=>{
        fetch(getPlayers).then(resp=> resp.json())
        .then(resp=>{
            console.log('Game ' + game.game_Id + 'and players '+ resp);
            setPlayers(resp);
               
            // setPlayers(players = [resp]);
            // this.setPlayers({players: [...resp]});
    
            // console.log('there are '+ this.players.length+ ' in this game');
            
            
        }).catch(error=>{
            console.log('Something fucked up in the game item')
            console.log(error);
            
        })
        
        });




    return (
        <div>
            <h4>{game.name}</h4>
            <p># of players: {players.length}</p>
            <p>Relevant dates</p>
            <p>{game.game_State}</p>
        </div>
    );

}

export default GameItem;

