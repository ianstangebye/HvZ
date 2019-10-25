import React, {Fragment} from 'react';
import styles from './TimerFragment.module.css';
import Moment from 'react-moment';
import moment from 'moment';

class TimerFragment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            game: props.game,
            game_id: props.game_id,
            userInfo: props.userInfo
        }
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState({
            game: this.props.game,
            game_id: this.props.game_id,
            userInfo: this.props.userInfo
        })
        // const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}`;

        // await fetch(targetUrl).then(resp => resp.json())
        // .then(resp => {
        //     //console.log(resp);
        //     this.setState({
        //         game: {...resp}
        //     });

        // }).catch(error => {
        //     console.log('Something fucked up')
        //     console.log(error);
        // });
    }

    timerBeforeStart = (time) => {
        let currentTime = new Date();

        console.log();

        if (moment(currentTime).isAfter(this.state.game.start_Time)) {
            let game = this.state.game;
            game.game_State = "In Progress";
            this.setState({ game: game }, () => {
                this.startGame();
            });
        }
    }

    startGame = async () => {
        if (!this.state.game.has_Patient_Zero) {
            const targetUrl = `http://case-hvzapi.northeurope.azurecontainer.io/game/${this.state.game_id}/zero`

            await fetch(targetUrl, {
                method: 'POST',
                body: JSON.stringify(this.state.game),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                }
            })
                .then(resp => {
                    if (resp.status === 200) {
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
                    alert("An unexpected error occurred. Please try again later.")
                });
        }

        this.updateGameState();
    }

    timerBeforeEnd = () => {
        let currentTime = new Date();

        if (moment(currentTime).isAfter(this.state.game.end_Time)) {
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
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.state.userInfo.token
            }
        })
            .then(resp => {
                if (resp.status === 200) {
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
                alert("An unexpected error occurred. Please try again later.")
            });

        this.props.onUpdate();
    }
    
    render() {
        const game = this.state.game
        const gameState = game.game_State

        const hasStarted = gameState !== "Registration"
        let timeTxt = ""

        switch(gameState) {
            case "Registration":
                timeTxt = "STARTS: "
                break
            case "In Progress":
                timeTxt = "ENDS: "
                break
            case "Complete":
                timeTxt = "ENDED: "
        }

        return (
            <Fragment>
                <div className={styles.Timer}>
                    <div className={styles.TimerMoment}>
                        <div className={styles.Time}>
                            <p>{hasStarted ? "END TIME: " : "START TIME: "}</p>
                            <p><Moment format="YYYY-MM-DD HH:mm">
                                {hasStarted ? game.end_Time : game.start_Time}
                            </Moment></p>
                        </div>
                        <div className={styles.FromNow}>
                            <p>{timeTxt}</p>
                            <p><Moment fromNow className={styles.timer_fromNow}
                                onChange={hasStarted ? this.timerBeforeEnd : this.timerBeforeStart}>
                                {hasStarted ? game.end_Time : game.start_Time}
                            </Moment></p>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default TimerFragment;