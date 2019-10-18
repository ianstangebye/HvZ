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
            token: "",
            joinedGameId: 0
        };
    }

    // state = {
    //     games: [],
    //     user_id: 0,
    //     loggedOut: false
    // }

    async componentDidMount() {
        //Update the component in every minute
        //this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);

        //const user_id = window.sessionStorage.getItem("user_id") || 0;
        //const is_admin = window.sessionStorage.getItem("is_admin") === "true" ? true : false;
        //const token = window.sessionStorage.getItem("token") || "";
        if(this.props.location.state) {
            const user_id = this.props.location.state.user_id || 0;
            const is_admin = this.props.location.state.is_admin || false;
            const token = this.props.location.state.token || ""; 
            
            this.setState((prevState, props) => {
                return {
                    user_id: user_id,
                    is_admin: is_admin,
                    token: token
                };
            });
        }
        
        
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

        window.addEventListener('onbeforeunload', this.clearStates);
    }

    // componentWillUnmount() {
    //     clearInterval(this.interval);
    // }

    clearStates = () => {
        //localStorage.clear();
        //window.sessionStorage.clear();

        this.setState((prevState, props) => {
            return {
                user_id: 0,
                is_admin: false,
                token: ""
            };
        }, () => {
            //this.forceUpdate();
            this.props.history.replace({'pathname': '/', 
                state: {
                    user_id: 0,
                    is_admin: false,
                    token: ''
                }})
        });
        //console.log("after clear: " + this.state.user_id);

        //this.forceUpdate();
    }

    updateLoggedIn = (user_id, is_admin, token) => {
        this.setState((prevState, props) => {
            return {
                user_id: user_id,
                is_admin: is_admin,
                token: token
            };
        });
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
                <Link to={{
                    pathname: '/login',
                    // onLoggedIn: this.updateLoggedIn
                    }}
                    style={{ display: this.state.user_id === 0 ? 'inline' : 'none' }}>
                    <button className={styles.Login_btn}>
                        Sign in
                    </button>
                </Link>
                {/* <Link to={'/login'}
                    style={{ display: this.state.user_id === 0 ? 'inline' : 'none' }}>
                    <button className={styles.Login_btn}>
                        Sign in
                    </button>
                </Link> */}
                <button className={styles.Logout_btn}
                    style={{ display: this.state.user_id !== 0 ? 'inline' : 'none' }}
                    onClick={this.clearStates}>
                        Sign out
                </button>
                <h1 className={styles.Current_games}>Games</h1>
                <div className={styles.GameComponents}>
                    {gameComponents}
                </div>
                <Link to={'/new-game-form'}
                    style={{ display: this.state.is_admin === true ? 'block' : 'none' }}>
                    <button className={styles.NewGame_btn}>
                        Create New Game
                    </button>
                </Link>
            </React.Fragment>
        );
    }
}

export default GameList;