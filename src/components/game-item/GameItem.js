import React, { useState, useEffect } from 'react';
import styles from './GameItem.module.css';
import { Link } from 'react-router-dom';
import playersIcon from '../../assets/players-icon.svg';
import Moment from 'react-moment';
import backEndUrl from '../../backEndUrl';

function GameItem(props) {
    // let game = {
    //     // name: 'Game 1',
    //     // game_State: 'In Progress'
    // };

    const { game } = props;
    const { userInfo } = props;

    const user_id = userInfo ? userInfo.user_id : 0;

    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState("");

    //const user_id = sessionStorage.getItem('user_id') || 0;
    //const loggedIn = localStorage.getItem('loggedIn') || "false";
    //// console.log("loggedIn " + loggedIn);

    //// console.log("user_id: " + user_id);

    //// console.log(game.game_Id);

    // let [players, setPlayers] = useState(0);

    const getPlayers = backEndUrl + `${game.game_Id}/player`;

    useEffect(() => {
        fetch(getPlayers).then(resp => resp.json())
            .then(resp => {
                //// console.log('Game ' + game.game_Id + 'and players ' + resp);
                setPlayers(resp);

                // setPlayers(players = [resp]);
                // this.setPlayers({players: [...resp]});

                // // console.log('there are '+ this.players.length+ ' in this game');


            }).catch(error => {
                // console.log('Something fucked up in the game item')
                console.error(error);

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

        

    }, [game.game_State]);

    if (user_id !== 0 && user_id !== undefined) {
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
                            <p className={styles.Players}><img src={playersIcon} alt="players"/> {players.length}</p>
                            <p className={styles.StartDate}>Start: <Moment format="YYYY-MM-DD HH:mm">
                                   {game.start_Time}
                                </Moment></p>
                            <p className={styles.EndDate}>End: <Moment format="YYYY-MM-DD HH:mm">
                                   {game.end_Time}
                                </Moment></p>
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
                    <p className={styles.Players}><img src={playersIcon} alt="players"/>{players.length}</p>
                    <p className={styles.StartDate}>Start: <Moment format="YYYY-MM-DD HH:mm">
                                   {game.start_Time}
                                </Moment></p>
                    <p className={styles.EndDate}>End: <Moment format="YYYY-MM-DD HH:mm">
                                   {game.end_Time}
                                </Moment></p>
                    <p className={styles.GameState} style={{backgroundColor: gameState}}>{game.game_State}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default GameItem;