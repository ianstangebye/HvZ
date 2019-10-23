import React, {useState, useEffect} from 'react';
// import { styles } from 'ansi-colors';
import styles from './MissionItem.module.css';
import Moment from 'react-moment';
import moment from 'moment';

class MissionItem extends React.Component {
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

    }
    
    startTimer() {
        this.interval = setInterval(() => {
            this.timerAction();
        }, 1000);
    }

    timerAction = () => {
        let currentTime = new Date();

        // if (moment(currentTime).isAfter(this.state.game.end_Time)) {
        // if(!this.state.started ) {
        // }
    }

    onClickMore = () => {
        const toggle = !this.state.onMore;
        this.setState({
            onMore: toggle
        })
    }

    setMarker = () => {
        //this.props.setMissionMarker(this.state.mission);
    }

    deleteMission = () => {
        //this.props.deleteMissionMarker(this.state.mission);
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
    
        return (
            <React.Fragment>
                <div className={styles.MissionListItem}>
                    <div className={styles.Time}>
                        <p>Start: {startDate.toLocaleString()}</p>
                        <p>End: {endDate.toLocaleString()}</p>
                    </div>
                    <h4>{mission.name}</h4>
                    <p className={styles.Type} style={{ color: missionColor }}>{missionType}</p>
                    {/* <p className={styles.Descripiton}>{mission.description}</p> */}
                    <button onClick={this.onClickMore}>More</button>

                    <div className={styles.More} style={{ display: this.state.onMore ? 'block' : 'none' }}>
                        <p>Description: {mission.description}</p>
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