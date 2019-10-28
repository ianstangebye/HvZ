import React, {Fragment} from 'react'
import styles from './TimerFragment.module.css'
import Moment from 'react-moment'
import moment from 'moment'
import { FaEdit } from 'react-icons/fa'
import { FaSave } from 'react-icons/fa'
import { DatePicker, theme } from 'react-trip-date';
import { ThemeProvider } from 'styled-components';
import backEndUrl from '../../backEndUrl';
import axios from 'axios'

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
        const startDateTime = this.props.game.start_Time
        const endDateTime = this.props.game.end_Time

        const newStartDate = startDateTime ? startDateTime.substring(0, 10) : "0000-00-00"
        const newEndDate = endDateTime ? endDateTime.substring(0, 10) : "0000-00-00"
        const newStartTime = startDateTime ? startDateTime.substring(11) : "00:00:00"
        const newEndTime = endDateTime ? endDateTime.substring(11) : "00:00:00"

        this.setState({
            game: this.props.game,
            game_id: this.props.game_id,
            userInfo: this.props.userInfo,
            newStartDate: newStartDate,
            newEndDate: newEndDate,
            newStartTime: newStartTime,
            newEndTime: newEndTime
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
        // .then(resp => {
        //     console.log(resp);
        // })
        .catch(e => {
            console.error(e);
            alert("An unexpected error occurred. Please try again later.")
        });

        this.props.onUpdate();
    }

    editTime = () => {
        if(this.state.editing) {
            const url = `${backEndUrl}${this.state.game_id}`
            const editedGame = this.state.game
            editedGame.start_Time = `${this.state.newStartDate}T${this.state.newStartTime}`
            editedGame.end_Time = `${this.state.newEndDate}T${this.state.newEndTime}`
            let currentTime = new Date();
            let hasStarted = moment(currentTime).isAfter(editedGame.start_Time)
            let hasEnded = moment(currentTime).isAfter(editedGame.end_Time)
            editedGame.game_State = hasStarted ? hasEnded ? "Complete" : "In Progress" : "Registration"

            axios
            .put(url, editedGame, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.state.userInfo.token
                }
            })
            .then(res => {
                if(res.status === 200) {
                    alert("Changes successfully saved!")
                    this.props.onUpdate()
                } else {
                    throw new Error(`STATUS CODE: ${res.status}`)
                }
            })
            .catch(e => {
                alert("Something went wrong. Try again.")
                console.error(e)
            })
        }

        this.setState({editing: !this.state.editing})
    }

    handleDateChange = (days) => {
        if(days.length > 0) {
            days.sort()
            let newStartDate = days[0]
            let newEndDate = days.length > 1 ? days[1] : newStartDate

            this.setState({
                newStartDate: newStartDate,
                newEndDate: newEndDate
            })
        }
    }

    timeInputChanged = (start, e) => {
        if(start) {
            this.setState({newStartTime: e.target.value})
        } else {
            this.setState({newEndTime: e.target.value })
        }
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

        let startDate, endDate = null
        if(game.start_Time) {
            startDate = game.start_Time.substring(0, 10)
            endDate = game.end_Time.substring(0, 10)
        }

        const calendar =
            <div className={styles.DatePickerContainer}>
                <ThemeProvider theme={theme}>
                    <DatePicker
                        handleChange={(days) => this.handleDateChange(days)}
                        selectedDays={[startDate, endDate]}
                        numberOfMonths={1}
                        numberOfSelectableDays={2}
                        disabledBeforToday={false}
                    />
                </ThemeProvider>
                <p>From: {`${this.state.newStartDate}`} <input value={this.state.newStartTime} placeholder="hh:mm:ss" onChange={(e) => this.timeInputChanged(true, e)}></input></p>
                <br />
                <p>To: {`${this.state.newEndDate}`} <input value={this.state.newEndTime} placeholder="hh:mm:ss" onChange={(e) => this.timeInputChanged(false, e)}></input></p>
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