import React from 'react';
import styles from './GameList.module.css';
import GameItem from '../game-item/GameItem';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
// import { read } from 'fs';

class GameList extends React.Component {

    state = {
        games: [],
        user_id: 0,
        loggedOut: false
    }

    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         games: []
    //     }
    // }

    async componentDidMount() {

        let user_id = localStorage.getItem('user_id') || 0;
        this.setState({ user_id: user_id });
        this.setState({ loggedOut: false });
        //const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game`;

        console.log("something");

        //need to set in the correct 
        await fetch(targetUrl).then(resp => resp.json())
            .then(resp => {
                console.log(resp);
                this.setState({
                    games: [...resp]
                });
                console.log(this.state.games);

            }).catch(error => {
                console.log('Something fucked up')
                console.log(error);

            });

        window.addEventListener('onbeforeunload', this.clearLocalStorage);
    }

    clearLocalStorage() {
        localStorage.clear();
    }

    render() {
        // if(this.state.loggedOut == true) {
        //     return <Redirect push to="/" />;
        // }
        //console.log(this.state.games);

        let gameComponents = null;


        if (this.state.games.length > 0) {
            gameComponents = this.state.games.map(game => {
                return <GameItem game={game} key={game.game_Id} />
                //return <p>hELLOOOO</p>
            });
        } else {
            gameComponents = <p>Loading games...</p>
        }

        return (
            <React.Fragment>
                <h1 className={styles.Current_available}>Currently available games</h1>
                <Link to={'/login'}
                    style={{ visibility: this.state.user_id == 0 ? 'visible' : 'hidden' }}>
                <button className={styles.Login_btn}>
                    Login
                </button>
                </Link>
                <button className={styles.Logout_btn}
                    style={{ visibility: this.state.user_id != 0 ? 'visible' : 'hidden' }}
                    onClick={this.clearLocalStorage}>
                    Log out
                </button>
                <div>
                    {gameComponents}
                </div>
            </React.Fragment>
        );
    }
}

export default GameList;