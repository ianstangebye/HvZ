import React from 'react';
// import Styles from './GameList.module.css';

function GameItem(props){
    // let game = {
    //     // name: 'Game 1',
    //     // game_State: 'In Progress'
    // };

    const {game} = props;

    return (
        <div>
            <h4>{game.name}</h4>
            <p>Number of registered players</p>
            <p>Relevant dates</p>
            <p>{game.game_State}</p>
        </div>
    );
}

export default GameItem;

