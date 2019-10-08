import React from 'react';
import Styles from './CardList.module.css';

function GameItem(props){
    const {gameItem} = props;

    return (
        <div>
            <h4>Card.name</h4>
            <p>Number of registered players</p>
            <p>Relevant dates</p>
            <p>Game Status</p>
        </div>
    )
}

export default GameItem;

