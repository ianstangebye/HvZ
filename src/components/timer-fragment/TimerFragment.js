import React, {Fragment} from 'react'
import styles from './TimerFragment.module.css'
import Moment from 'react-moment'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'
import { FaSave } from 'react-icons/fa'
import { DatePicker, theme } from 'react-trip-date';
import { ThemeProvider } from 'styled-components';
import backEndUrl from '../../backEndUrl';

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
        // const targetUrl = backEndUrl + `${this.state.game_id}`;

        // await fetch(targetUrl).then(resp => resp.json())
        // .then(resp => {
        //     //// console.log(resp);
        //     this.setState({
        //         game: {...resp}
        //     });

        // }).catch(error => {
        //     // console.log('Something fucked up')
        //     // console.log(error);
        // });
    }

    timerBeforeStart = (time) => {
        if(this.state.userInfo.is_admin) {
            let currentTime = new Date();

            if (moment(currentTime).isAfter(this.state.game.start_Time)) {
                let game = this.state.game;
                game.game_State = "In Progress";
                this.setState({ game: game }, () => {
                    this.startGame();
                });
            }
        }
    }

    startGame = async () => {
        if (!this.state.game.has_Patient_Zero) {
            const targetUrl = backEndUrl + `${this.state.game_id}/zero`

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
                    // console.log(resp);
                })
                .catch(e => {
                    console.error(e);
                    alert("An unexpected error occurred. Please try again later.")
                });
        }

        this.updateGameState();
    }

    timerBeforeEnd = () => {
        if(this.state.userInfo.is_admin) {
            let currentTime = new Date();

            if (moment(currentTime).isAfter(this.state.game.end_Time)) {
                let game = this.state.game;
                game.game_State = "Complete";
                this.setState({ game: game }, () => {
                    this.endGame();
                });
            }
        }
    }

    endGame = () => {
        this.updateGameState();
        // DELETE ALL DATA OF THIS GAME?
    }

    updateGameState = async () => {
        const targetUrl = backEndUrl + `${this.state.game_id}`

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
                // console.log(resp);
            })
            .catch(e => {
                console.error(e);
                alert("An unexpected error occurred. Please try again later.")
            });

        this.props.onUpdate();
    }

    editTime = () => {
        if(this.state.editing) {
            // Save the selected dates (if different) with a put request
            // console.log("Successfully edited start/end-time")
        }

        this.setState({editing: !this.state.editing})
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
                break
            default:
                break
        }

        let editButton = null
        if(this.state.userInfo.is_admin) {
            editButton = <div style={{display: "inline", marginLeft: "5px", padding: "0"}} onClick={this.editTime}>{this.state.editing ? <FaSave /> : <FaEdit />}</div>
        }

        const Day = ({ day }) => {
            return (
                <p className="date">{day.format('DD')}</p>
            )
        }

        const calendar =
            <div className={styles.DatePickerContainer}>
                <ThemeProvider theme={theme}>
                    <DatePicker
                        // handleChange={(days) => this.editTime(days)}
                        // selectedDays={[startDate]} //initial selected days
                        numberOfMonths={1}
                        numberOfSelectableDays={2}
                        disabledBeforToday={false}
                        dayComponent={Day}
                    />
                </ThemeProvider>
                <p>From: {`${game.start_Time}`.replace("T", " ")}</p>
                <br />
                <p>To: {`${game.end_Time}`.replace("T", " ")}</p>
            </div>
        

        return (
            <Fragment>
                <div className={styles.Timer}>
                    <div className={styles.TimerMoment}>
                        <div className={styles.Time}>
                            <p>{hasStarted ? "END TIME: " : "START TIME: "}</p>
                            <p><Moment format="YYYY-MM-DD HH:mm">
                                {hasStarted ? game.end_Time : game.start_Time}
                            </Moment></p>
                            {editButton}
                            {this.state.editing ? calendar : null}
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