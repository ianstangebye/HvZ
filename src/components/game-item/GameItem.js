import React, { useState, useEffect } from 'react';
import styles from './GameItem.module.css';
import { Link } from 'react-router-dom';

function GameItem(props) {



    // let game = {
    //     // name: 'Game 1',
    //     // game_State: 'In Progress'
    // };

    const { game } = props;
    const [players, setPlayers] = useState([]);
    const user_id = localStorage.getItem('user_id') || 0;
    //const loggedIn = localStorage.getItem('loggedIn') || "false";
    //console.log("loggedIn " + loggedIn);
    
    console.log("user_id: " + user_id);
    
    console.log(game.game_Id);

    // let [players, setPlayers] = useState(0);

    const getPlayers = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game.game_Id}/player`;

    useEffect(() => {
        fetch(getPlayers).then(resp => resp.json())
            .then(resp => {
                console.log('Game ' + game.game_Id + 'and players ' + resp);
                setPlayers(resp);

                // setPlayers(players = [resp]);
                // this.setPlayers({players: [...resp]});

                // console.log('there are '+ this.players.length+ ' in this game');


            }).catch(error => {
                console.log('Something fucked up in the game item')
                console.log(error);

            })

    },[]);




    return (
        <React.Fragment>
            <div>
                <h4>{game.name}</h4>
                <p># of players: {players.length}</p>
                <p>Relevant dates</p>
                <p>{game.game_State}</p>
            </div>
            <div>
            <Link to={'/game-detail/' + game.game_Id} 
                style={{ visibility: user_id != 0? 'visible': 'hidden'}}>
                <button className={styles.Login_btn}>
                    Join
                </button>  
            </Link>
            </div>
        </React.Fragment>
    );

}

export default GameItem;

