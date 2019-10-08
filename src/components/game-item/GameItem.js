import React from 'react';
// import Styles from './GameList.module.css';

function GameItem(props){
    const {gameItem} = props;

    return (
        <div>
            <h4>{gameItem.name}</h4>
            <p>Number of registered players</p>
            <p>Relevant dates</p>
            <p>{gameItem.game_State}</p>
        </div>
    )
}

export default GameItem;

