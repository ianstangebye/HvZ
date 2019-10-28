import React from 'react';
import styles from './GameList.module.css';
import GameItem from '../game-item/GameItem';
import { Link } from 'react-router-dom';
import Header from '../header/Header';
import backEndUrl from '../../backEndUrl';
// import { read } from 'fs';

class GameList extends React.Component {

    constructor(props) {
        super(props);

        const states = props.location.state || null;

        this.state = {
            games: [],
            //user_id: 0,
            //is_admin: false,
            //token: "",
            loggedIn: states ? states.loggedIn : false,
            userInfo: states ? states.userInfo : {}
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
            // const user_id = this.props.location.state.user_id || 0;
            // const is_admin = this.props.location.state.is_admin || false;
            // const token = this.props.location.state.token || ""; 
            
            // this.setState((prevState, props) => {
            //     return {
            //         user_id: user_id,
            //         is_admin: is_admin,
            //         token: token
            //     };
            // });
            this.setState({
                loggedIn: this.props.location.state.loggedIn,
                userInfo: this.props.location.state.userInfo
            })
        }
        
        
        // console.log(window.sessionStorage.getItem("user_id"));

        // console.log("list user_id: " + this.state.user_id);
        // console.log("list is_admin: " + this.state.is_admin);

        //const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        //const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game`;
        //const targetUrl = `https://52.142.92.199/game`;
        
        //need to set in the correct 
        await fetch(backEndUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(resp => resp.json())
            .then(resp => {
                //console.log(resp);
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
        // this.setState({
        //     loggedIn: false,
        //     userInfo: {}
        // }, () => {
            // this.props.history.replace({'pathname': '/', state: {
            //     loggedIn: false,
            //     userInfo: {}
            // }});
        window.history.replaceState(null, null, '/');
        window.location.reload(false);
        // })
        //console.log("after clear: " + this.state.user_id);

        //this.forceUpdate();


        sessionStorage.clear()
    }

    // updateLoggedIn = (user_id, is_admin, token) => {
    //     this.setState((prevState, props) => {
    //         return {
    //             user_id: user_id,
    //             is_admin: is_admin,
    //             token: token
    //         };
    //     });
    // }

    render() {
        let gameComponents = null;
        
        if (this.state.games.length > 0) {
            let curGameComponents = this.state.games;
            curGameComponents.sort((a, b) => {
                if (a.game_State < b.game_State) {
                    return -1;
                }
                if (a.game_State > b.game_State) {
                    return 1;
                }
                return 0;
            }).reverse();

            gameComponents = curGameComponents.map(game => {
                return <GameItem game={game} key={game.game_Id} user_id={this.state.user_id} userInfo={this.state.userInfo}/>
                //return <p>hELLOOOO</p>
            });
        } else {
            gameComponents = <p>Loading games...</p>
        }

        const is_admin = this.state.userInfo ? this.state.userInfo.is_admin : false;

        return (
            <React.Fragment>
                <Header userInfo={this.state.userInfo} loggedIn={this.state.loggedIn}></Header>
                <Link to={{
                    pathname: '/login',
                    // onLoggedIn: this.updateLoggedIn
                    }}
                    style={{ display: !this.state.loggedIn ? 'inline' : 'none' }}>
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
                    style={{ display: this.state.loggedIn ? 'inline' : 'none' }}
                    onClick={this.clearStates}>
                        Sign out
                </button>
                <h1 className={styles.Current_games}>Games</h1>
                <div className={styles.GameComponents}>
                    {gameComponents}
                </div>
                <Link to={{
                    pathname: '/new-game-form',
                    state: { 
                        userInfo: this.state.userInfo,
                        loggedIn: true
                    }}} style={{ display: is_admin === true ? 'block' : 'none' }}>
                    <button className={styles.NewGame_btn}>
                        Create New Game
                    </button>
                </Link>
            </React.Fragment>
        );
    }
}

export default GameList;