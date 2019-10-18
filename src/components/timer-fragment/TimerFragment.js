import React from 'react';
import styles from './TimerFragment.module.css';
import Moment from 'react-moment';
import moment from 'moment';

class TimerFragment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            game: {},
            game_id: props.game_id,
        }
    }

    async componentDidMount() {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}`;
        //console.log("timer url: " + targetUrl);

        await fetch(targetUrl).then(resp => resp.json())
        .then(resp => {
            //console.log(resp);
            this.setState({
                game: {...resp}
            });

            // console.log("start_time: " + this.state.game.start_Time);
            // console.log("end_time: " + this.state.game.end_Time);
            // console.log("game_state: " + this.state.game.game_State);
            
        }).catch(error => {
            console.log('Something fucked up')
            console.log(error);
        });
    }

    timerBeforeStart = (time) => {        
        let currentTime = new Date();

        if(moment(currentTime).isAfter(this.state.game.start_Time)) { 
            let game = this.state.game;
            game.game_State = "In Progress";
            this.setState({ game: game }, () => {
                this.startGame();
            });
        }
    }

    startGame = async () => {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/zero`

        await fetch(targetUrl, {
            method: 'POST',
            body: JSON.stringify(this.state.game),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(resp => {
            if(resp.status === 200) {
                return resp.json();
            } else {
                throw new Error(`STATUS CODE: ${resp.status}`)
            }
        })
        .then(resp => {
            console.log(resp);
            this.updateGameState();
        })
        .catch(e => {
            console.error(e);
            alert("An unexpected error occured. Please try again later.")
        });
        //this.props.startGame();
    }

    timerBeforeEnd = () => {
        let currentTime = new Date();

        if(moment(currentTime).isAfter(this.state.game.end_Time)) { 
            let game = this.state.game;
            game.game_State = "Complete";
            this.setState({ game: game }, () => {
                this.endGame();
            });
        }
    }

    endGame = () => {
        this.updateGameState();
        // DELETE ALL DATA OF THIS GAME?
    }

    updateGameState = async () => {
        const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}`

        await fetch(targetUrl, {
            method: 'PUT',
            body: JSON.stringify(this.state.game),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(resp => {
            if(resp.status === 200) {
                return resp.json();
            } else {
                throw new Error(`STATUS CODE: ${resp.status}`)
            }
        })
        .then(resp => {
            console.log(resp);
        })
        .catch(e => {
            console.error(e);
            alert("An unexpected error occured. Please try again later.")
        });
    }

    render() {
        if(this.state.game.game_State === 'Registration') {
            return (
                <React.Fragment>
                    <div className={styles.Timer}>
                        {/* <div className={styles.GameState}>
                            <h2>Game State: {this.state.game.game_State}</h2>
                        </div> */}
                        <div className={styles.TimerMoment}>
                            <div className={styles.Time}>
                                <p>Start Time: </p>
                                <p><Moment format="YYYY-MM-DD HH:mm">
                                   {this.state.game.start_Time}
                                </Moment></p>
                            </div>
                            <div className={styles.FromNow}>
                                <p>From Now: </p>
                                <p><Moment fromNow className={styles.timer_fromNow} 
                                    onChange={(time) => {this.timerBeforeStart(time)}}>
                                    is.state.game.start_Time}
                                </Moment></p>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        } else if (this.state.game.game_State === 'In Progress') {
            return (
                <React.Fragment>
                    <div className={styles.Timer}>
                        {/* <div className={styles.GameState}>
                            <h2>Game State: {this.state.game.game_State}</h2>
                        </div> */}
                        <div className={styles.TimerMoment}>
                            <div className={styles.Time}>
                                <p>End Time: </p>
                                <p><Moment format="YYYY-MM-DD HH:mm">
                                    {this.state.game.end_Time}
                                </Moment></p>
                            </div>
                            <div className={styles.FromNow}>
                                <p>From Now: </p>
                                <p><Moment fromNow className={styles.timer_fromNow} 
                                    onChange={(time) => {this.timerBeforeEnd(time)}}>
                                    {this.state.game.end_Time}
                                </Moment></p>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    {/* <div className={styles.timer}>
                        <h2>Game State: {this.state.game.game_State}</h2>
                    </div> */}
                </React.Fragment>
            )
        }
    }
}

export default TimerFragment;