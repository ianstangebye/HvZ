import React from 'react';
import MissionItem from '../mission-item/MissionItem';
import styles from './MissionList.module.css';
import arrowUpIcon from '../../assets/arrow-up-icon.svg';
import arrowDownIcon from '../../assets/arrow-down-icon.svg';

class MissionList extends React.Component{
    constructor(props) {
        super(props)

        this.state = {
            game_id: props.game_id,
            missions: props.missions,
            userInfo: props.userInfo,
            isVisible: true
        }
    }

    componentWillReceiveProps() {
        this.setState({
            game_id: this.props.game_id,
            missions: this.props.missions,
            userInfo: this.props.userInfo
        })
    }

    componentDidMount(){

        // const game_id = this.state.game_id;

        // fetch(`http://case-hvzapi.northeurope.azurecontainer.io/game/${game_id}/mission`, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + this.state.userInfo.token
        //     }
        // }).then(resp=>resp.json())
        // .then(resp=>{
        //     console.log("MissionList");
            
        //     console.log(resp);
        //     this.setState({
        //         missions: [...resp]
        //     });
        // }).catch(error=>{
        //     console.log(error);
            
        // });
    }

    handleClick = () => {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    render(){

        let missionComponents = null;

        if(this.props.missions.length>0){
            missionComponents = this.props.missions.map(mission=>{
                return <MissionItem mission={mission} key={mission.mission_Id} userInfo={this.state.userInfo} />
            });
        } else {
            missionComponents = <p>Loading missions...</p>
        }

        let visible = this.state.isVisible;
        let arrow = <img src={visible ? arrowUpIcon : arrowDownIcon} alt={visible ? "UP" : "DOWN"} />

        return (
            <React.Fragment>
                <div className={styles.MissionList}>
                    <div className={styles.Title}>
                        <h1>Missions</h1>
                        <button className={styles.CollapseBtn} id="MissionCollapseBtn" type="button" onClick={this.handleClick}>{arrow}</button>
                    </div>
                </div>
                <div className={styles.MissionComponents} style={{display: this.state.isVisible ? 'block' : 'none'}}>
                    {missionComponents}
                </div>
            </React.Fragment>
        )

    }
}

export default MissionList;