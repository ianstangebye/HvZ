import React from 'react';
import styles from './GameList.module.css';
import GameItem from '../game-item/GameItem';
import { Link } from 'react-router-dom';
// import { read } from 'fs';

class GameList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            games: [],
            user_id: 0,
            is_admin: false,
            token: ""
        };
    }

    // state = {
    //     games: [],
    //     user_id: 0,
    //     loggedOut: false
    // }

    async componentDidMount() {
        const user_id = window.sessionStorage.getItem("user_id") || 0;
        const is_admin = window.sessionStorage.getItem("is_admin") === "true" ? true : false;
        const token = window.sessionStorage.getItem("token") || "";

        this.setState((prevState, props) => {
            return {
                user_id: user_id,
                is_admin: is_admin,
                token: token
            };
        });
        // console.log(window.sessionStorage.getItem("user_id"));

        // console.log("list user_id: " + this.state.user_id);
        // console.log("list is_admin: " + this.state.is_admin);

        //const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game`;

        //need to set in the correct 
        await fetch(targetUrl).then(resp => resp.json())
            .then(resp => {
                console.log(resp);
                this.setState({
                    games: [...resp]
                });

            }).catch(error => {
                console.log('Something fucked up')
                console.log(error);

            });

        window.addEventListener('onbeforeunload', this.clearLocalStorage);
    }

    clearLocalStorage = () => {
        //localStorage.clear();
        window.sessionStorage.clear();

        this.setState((prevState, props) => {
            return {
                user_id: 0,
                is_admin: false,
                token: ""
            };
        }, () => {
            this.forceUpdate();
        });
        //console.log("after clear: " + this.state.user_id);

        //this.forceUpdate();
    }

    render() {
        let gameComponents = null;

        if (this.state.games.length > 0) {
            gameComponents = this.state.games.map(game => {
                return <GameItem game={game} key={game.game_Id} user_id={this.state.user_id} />
                //return <p>hELLOOOO</p>
            });
        } else {
            gameComponents = <p>Loading games...</p>
        }

        return (
            <React.Fragment>
                <h1 className={styles.Current_games}>Currently available games</h1>
                
                <Link to={'/login'}
                    style={{ display: this.state.user_id === 0 ? 'inline' : 'none' }}>
                    <button className={styles.Login_btn}>
                        Login
                    </button>
                </Link>
                <button className={styles.Logout_btn}
                    style={{ display: this.state.user_id !== 0 ? 'inline' : 'none' }}
                    onClick={this.clearLocalStorage}>
                        Log out
                </button>
                <Link to={'/new-game-form'}
                    style={{ display: this.state.is_admin == true ? 'block' : 'none' }}>
                    <button className={styles.NewGame_btn}>
                        Create New Game
                    </button>
                </Link>
                <div>
                    {gameComponents}
                </div>
            </React.Fragment>
        );
    }
}

export default GameList;