import React, {useState, useEffect} from 'react';
// import { styles } from 'ansi-colors';
import styles from './MissionItem.module.css';
import Moment from 'react-moment';
import moment from 'moment';

class MissionItem extends React.Component {
    _didMounted = false;

    constructor(props) {
        super(props) 

        this.state = {
            mission: props.mission,
            userInfo: props.userInfo,
            onMore: false,
            started: false,
            ended: false
        }
    }

    componentDidMount() {
        this._didMounted = true;

        if(this._didMounted) {
            let currentTime = new Date();
            const start_Time = this.state.mission.start_Time;
            const end_Time = this.state.mission.end_Time;

            if (!this.state.started && moment(currentTime).isAfter(start_Time)) {
                this.setState({
                    started: true
                })
            } else if (this.state.started && !this.state.ended && moment(currentTime).isAfter(end_Time)) {
                this.setState({
                    ended: true
                })
            }

            this.startTimer();
        }
    }
    
    startTimer() {
        this.interval = setInterval(() => {
            this.timerAction();
        }, 1000);
    }

    timerAction = () => {
        let currentTime = new Date();
        const start_Time = this.state.mission.start_Time;
        const end_Time = this.state.mission.end_Time;

        if (!this.state.started && moment(currentTime).isAfter(start_Time)) {
            this.startMission();
        } else if (this.state.started && !this.state.ended && moment(currentTime).isAfter(end_Time)) {
            this.endMission();
        }
    }

    startMission = () => {
        this.setState({
            started: true
        })
        this.props.onUpdateMap();
    }

    endMission = () => {
        this.setState({
            ended: true
        })
        this.props.onUpdateMap();
    }

    onClickMore = () => {
        const toggle = !this.state.onMore;
        this.setState({
            onMore: toggle
        })
    }

    render() {
        const mission = this.state.mission;
        const startDate = new Date(mission.start_Time);
        const endDate = new Date(mission.end_Time);
        let missionType = '';
        let missionColor = '';
    
        if(mission.is_Human_Visible && mission.is_Zombie_Visible) {
            missionType = 'For All Players';
            missionColor = 'purple';
        } else if (mission.is_Human_Visible) {
            missionType = 'For Only Humans';
            missionColor = 'blue';
        } else if (mission.is_Zombie_Visible) {
            missionType = 'For Only Zombies';
            missionColor = 'red';
        }
    
        let mission_state = '';
        let state_color = '';

        if(!this.state.started) {
            mission_state = "Not Started";
            state_color = "#A7C57C";
        } else if (this.state.started && !this.state.ended) {
            mission_state = "Ongoing";
            state_color = "#F5DA81";
        } else if (this.state.ended) {
            mission_state = "Ended";
            state_color = "#ED553B";
        }

        return (
            <React.Fragment>
                <div className={styles.MissionListItem}>
                    
                    <h4>{mission.name}</h4>
                    <p className={styles.Type} style={{ color: missionColor }}>{missionType}</p>
                    <h5 className={styles.State} style={{ color: state_color }}>{mission_state}</h5>
                    <button className={styles.MoreBtn} onClick={this.onClickMore}>More</button>

                    <div className={styles.More} style={{ display: this.state.onMore ? 'block' : 'none' }}>
                        <p>Description: {mission.description}</p>
                        <div className={styles.Time}>
                            <p>Start: {startDate.toLocaleString()}</p>
                            <p>End: {endDate.toLocaleString()}</p>
                        </div>
                        {/* <div className={styles.MoreBtns}>
                            <button style={{ gridColumn: 1 }} onClick={this.onClickEdit}>Edit</button>
                            <button style={{ gridColumn: 2 }} onClick={this.onClickSetMarker}>Set Marker</button>
                            <button style={{ gridColumn: 3 }} onClick={this.onClickDeleteMarker}>Delete Marker</button>
                        </div> */}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default MissionItem;