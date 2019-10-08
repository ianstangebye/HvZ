import React from 'react';
import Styles from './GameList.module.css';
import GameItem from '../game-item/GameItem';
import { read } from 'fs';

class GameList extends React.Component{
    state = {
        games: []
    }
}

componentDidMount(){
    fetch('').then(resp=> resp.json())
    .then(resp=>{
        console.log(resp);
        this.ListeningStateChangedEvent({
           games:  
        });
    });
}