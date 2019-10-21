import React, { useState, useEffect } from 'react';
import styles from './GameItem.module.css';
import { Link } from 'react-router-dom';
import playersIcon from '../../assets/players-icon.svg';

function GameItem(props) {
    // let game = {
    //     // name: 'Game 1',
    //     // game_State: 'In Progress'
    // };

    const { game } = props;
    const { userInfo } = props || null;

    const user_id = userInfo.user_id || 0;

    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState("");
    let gameStart = ''; 
    let gameEnd = '';

    //const user_id = sessionStorage.getItem('user_id') || 0;
    //const loggedIn = localStorage.getItem('loggedIn') || "false";
    //console.log("loggedIn " + loggedIn);

    //console.log("user_id: " + user_id);

    //console.log(game.game_Id);

    // let [players, setPlayers] = useState(0);

    const getPlayers = `http://case-hvzapi.northeurope.azurecontainer.io/game/${game.game_Id}/player`;

    useEffect(() => {
        fetch(getPlayers).then(resp => resp.json())
            .then(resp => {
                //console.log('Game ' + game.game_Id + 'and players ' + resp);
                setPlayers(resp);

                // setPlayers(players = [resp]);
                // this.setPlayers({players: [...resp]});

                // console.log('there are '+ this.players.length+ ' in this game');


            }).catch(error => {
                console.log('Something fucked up in the game item')
                console.log(error);

            })

    }, [game.game_Id, getPlayers]);

    // Adds background-color depending on the game-state
    useEffect(() => {
        if (game.game_State === 'Registration' || game.game_State === 'registration') {
            setGameState("#A7C57C");
        } else if (game.game_State === 'In Progress' || game.game_State === 'in progress') {
            setGameState("#F5DA81");
        } else if (game.game_State === 'Complete' || game.game_State === 'complete') {
            setGameState("#ED553B");
        }

        

    }, []);

    if (game.start_Time != '') {
        gameStart = game.start_Time;
        gameStart = gameStart.replace("T", " ");
        gameStart = gameStart.substring(0, gameStart.length - 3);
    }

    if (game.end_Time != '') {
        gameEnd = game.end_Time;
        gameEnd = gameEnd.replace("T", " ");
        gameEnd = gameEnd.substring(0, gameEnd.length - 3);
    }

    if (user_id !== 0) {
        

        return (
            <React.Fragment>
                <div>
                    <Link to={{
                                pathname: '/game-detail/' + game.game_Id,
                                state: {
                                    user_id: userInfo.user_id,
                                    userInfo: userInfo
                                } 
                            }}
                            style={{textDecoration: 'none'}}>                   
                        {/* style={{ display: user_id !== 0? 'block': 'none', textDecoration: 'none'}}> */}
                        <div className={styles.GameItem}>
                            <h4>{game.name}</h4>
                            <p className={styles.Players}><img src={playersIcon}/> {players.length}</p>
                            <p className={styles.StartDate}>Start: {gameStart}</p>
                            <p className={styles.EndDate}>End: {gameEnd}</p>
                            <p className={styles.GameState} style={{backgroundColor: gameState}}>{game.game_State}</p>
                        </div>
                    </Link>
                </div>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <div className={styles.GameItem}>
                    <h4>{game.name}</h4>
                    <p className={styles.Players}><img src={playersIcon}/>{players.length}</p>
                    <p className={styles.StartDate}>Start: {gameStart}</p>
                    <p className={styles.EndDate}>End: {gameEnd}</p>
                    <p className={styles.GameState} style={{backgroundColor: gameState}}>{game.game_State}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default GameItem;